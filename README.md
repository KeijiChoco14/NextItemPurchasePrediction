# 👗 FashionAI - Next Item Purchase Prediction

FashionAI is a deep learning-based recommendation system that predicts the next product category a user is likely to purchase based on their purchase history. The system utilizes a Gated Recurrent Unit (GRU) model to learn sequential shopping patterns and generate personalized fashion product recommendations.

## 🚀 Features

* Predict next purchase category using GRU
* Personalized fashion product recommendations
* Search products by product name, category, or ASIN
* Interactive dashboard built with React
* FastAPI backend for model serving
* Real-time recommendation generation
* Responsive and modern user interface

---

## 🏗️ System Architecture

```text
User Purchase History
            │
            ▼
 Category Encoding
            │
            ▼
      GRU Model
            │
            ▼
 Predicted Category
            │
            ▼
 Product Recommendation Engine
            │
            ▼
 Recommended Products
```

---

## 🧠 Deep Learning Model

### Model Architecture

```text
Input Sequence
      │
      ▼
Embedding Layer
      │
      ▼
GRU Layer
      │
      ▼
Dropout Layer
      │
      ▼
Dense Layer (ReLU)
      │
      ▼
Softmax Output
```

### Hyperparameters

| Parameter       | Value                           |
| --------------- | ------------------------------- |
| Model           | GRU                             |
| Optimizer       | Adam                            |
| Loss Function   | Sparse Categorical Crossentropy |
| Batch Size      | 64                              |
| Epochs          | 30                              |
| Sequence Length | 10                              |

---

## 📊 Dataset

Dataset: Amazon Fashion Reviews Dataset

Features used:

* Product Name
* Parent ASIN
* User ID
* Timestamp
* Category
* Rating
* Price
* Gender
* Color

Dataset was preprocessed to generate sequential user purchase histories for next-category prediction.

---

## 🖥️ Tech Stack

### Frontend

* React.js
* React Router
* CSS3

### Backend

* FastAPI
* TensorFlow
* Pandas
* NumPy

### Machine Learning

* TensorFlow / Keras
* GRU (Gated Recurrent Unit)
* Label Encoding
* Sequence Padding

---

## 📂 Project Structure

```text
FashionAI/
│
├── backend/
│   ├── app.py
│   ├── models/
│   │   └── final_gru_category_model.keras
│   ├── encoders/
│   │   └── category_encoder.pkl
│   └── data/
│       └── full_product_catalog.pkl
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/KeijiChoco14/NextItemPurchasePrediction.git
cd NextItemPurchasePrediction
```

### Backend Setup

```bash
cd backend

python -m venv .venv

.venv\Scripts\activate

pip install -r requirements.txt
```

Run backend:

```bash
uvicorn app:app --reload
```

Backend will run on:

```text
http://127.0.0.1:8000
```

---

### Frontend Setup

```bash
cd frontend

npm install
```

Run frontend:

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

## 📈 Future Improvements

* Product image integration
* User authentication
* Top-K recommendation evaluation
* Hybrid recommendation system
* ONNX model deployment
* Docker deployment

---

## 👨‍💻 Author

Albert Christian
Deni Dwi Cahyono
Sekar Mutiara Mufthi

Information Technology Student
Politeknik Caltex Riau

GitHub:
https://github.com/KeijiChoco14
