from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import tensorflow as tf
import pickle
import pandas as pd
import numpy as np
from tensorflow.keras.preprocessing.sequence import pad_sequences


app = FastAPI(
    title="Fashion Recommendation API",
    description="GRU Next Category Purchase Recommendation",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = tf.keras.models.load_model("models/final_gru_category_model.keras")

with open("encoders/category_encoder.pkl", "rb") as f:
    category_encoder = pickle.load(f)

with open("data/full_product_catalog.pkl", "rb") as f:
    df = pickle.load(f)

max_sequence_length = 10

required_columns = [
    "product_name",
    "parent_asin",
    "kategori",
    "rating",
    "price",
    "gender",
    "warna"
]

for col in required_columns:
    if col not in df.columns:
        df[col] = ""

df["product_name"] = df["product_name"].fillna("").astype(str).str.strip()
df["parent_asin"] = df["parent_asin"].fillna("").astype(str).str.strip()
df["kategori"] = df["kategori"].fillna("").astype(str).str.lower().str.strip()
df["gender"] = df["gender"].fillna("unknown").astype(str).str.lower().str.strip()
df["warna"] = df["warna"].fillna("unknown").astype(str).str.lower().str.strip()

df["rating"] = pd.to_numeric(df["rating"], errors="coerce").fillna(0)
df["price"] = pd.to_numeric(df["price"], errors="coerce").fillna(0)


class RecommendationRequest(BaseModel):
    product_names: list[str]
    top_n_category: int = 3
    top_n_products: int = 5


@app.get("/")
def home():
    return {
        "message": "Fashion Recommendation API is running",
        "total_products": int(len(df)),
        "total_categories": int(df["kategori"].nunique())
    }


@app.get("/products")
def get_products():
    products = (
        df[
            [
                "product_name",
                "parent_asin",
                "kategori",
                "rating",
                "price",
                "gender",
                "warna"
            ]
        ]
        .drop_duplicates(subset=["product_name", "parent_asin"])
        .sample(frac=1, random_state=42)
    )

    return {
        "count": int(len(products)),
        "products": products.to_dict(orient="records")
    }


@app.get("/categories")
def get_categories():
    return {
        "categories": sorted(list(category_encoder.classes_))
    }


def get_input_products(product_names):
    input_rows = []

    for product_name in product_names:
        keyword = product_name.lower().strip()

        matched = df[
            df["product_name"].str.lower().str.strip() == keyword
        ]

        if matched.empty:
            matched = df[
                df["parent_asin"].str.lower().str.strip() == keyword
            ]

        if not matched.empty:
            input_rows.append(matched.iloc[0])

    if len(input_rows) == 0:
        return pd.DataFrame()

    return pd.DataFrame(input_rows)


def build_personalized_products(category, score, input_df, request):
    products = df[df["kategori"] == category].copy()

    if products.empty:
        return []

    input_names = [
        name.lower().strip()
        for name in request.product_names
    ]

    products = products[
        ~products["product_name"].str.lower().isin(input_names)
    ]

    preferred_gender = None
    preferred_color = None
    preferred_price = None

    if not input_df.empty:
        if "gender" in input_df.columns and not input_df["gender"].empty:
            preferred_gender = input_df["gender"].mode().iloc[0]

        if "warna" in input_df.columns and not input_df["warna"].empty:
            preferred_color = input_df["warna"].mode().iloc[0]

        if "price" in input_df.columns:
            preferred_price = input_df["price"].mean()

    products["match_score"] = 0

    if preferred_gender and preferred_gender != "unknown":
        products.loc[
            products["gender"] == preferred_gender,
            "match_score"
        ] += 3

    if preferred_color and preferred_color != "unknown":
        products.loc[
            products["warna"] == preferred_color,
            "match_score"
        ] += 2

    if preferred_price is not None and preferred_price > 0:
        products["price_distance"] = abs(products["price"] - preferred_price)

        max_distance = products["price_distance"].max()

        if max_distance > 0:
            products["price_score"] = 1 - (
                products["price_distance"] / max_distance
            )
        else:
            products["price_score"] = 1

    else:
        products["price_score"] = 0

    products["final_score"] = (
        products["match_score"] * 10
        + products["rating"] * 3
        + products["price_score"] * 5
        + score * 100
    )

    products = (
        products
        .drop_duplicates(subset=["parent_asin"])
        .sort_values("final_score", ascending=False)
        .head(request.top_n_products)
    )

    results = []

    for _, row in products.iterrows():
        results.append({
            "product_name": str(row["product_name"]),
            "parent_asin": str(row["parent_asin"]),
            "kategori": str(row["kategori"]),
            "score": round(float(row["final_score"]), 2),
            "category_score": round(float(score) * 100, 2),
            "rating": float(row["rating"]),
            "price": float(row["price"]),
            "gender": str(row["gender"]),
            "warna": str(row["warna"])
        })

    return results


@app.post("/recommend")
def recommend(request: RecommendationRequest):
    input_df = get_input_products(request.product_names)

    if input_df.empty:
        return {
            "input_products": request.product_names,
            "input_categories": [],
            "predicted_categories": [],
            "recommendations": []
        }

    input_categories = input_df["kategori"].tolist()

    encoded_sequence = []

    for category in input_categories:
        if category in category_encoder.classes_:
            encoded_sequence.append(
                category_encoder.transform([category])[0]
            )

    if len(encoded_sequence) == 0:
        return {
            "input_products": request.product_names,
            "input_categories": input_categories,
            "predicted_categories": [],
            "recommendations": []
        }

    padded_sequence = pad_sequences(
        [encoded_sequence],
        maxlen=max_sequence_length,
        padding="pre"
    )

    predictions = model.predict(padded_sequence, verbose=0)[0]

    top_indices = predictions.argsort()[-request.top_n_category:][::-1]
    predicted_categories = category_encoder.inverse_transform(top_indices)

    predicted_result = []
    recommendations = []

    for idx, category in zip(top_indices, predicted_categories):
        category_score = float(predictions[idx])

        predicted_result.append({
            "kategori": str(category),
            "score": round(category_score * 100, 2)
        })

        product_results = build_personalized_products(
            category=category,
            score=category_score,
            input_df=input_df,
            request=request
        )

        recommendations.extend(product_results)

    return {
        "input_products": request.product_names,
        "input_categories": input_categories,
        "predicted_categories": predicted_result,
        "recommendations": recommendations
    }