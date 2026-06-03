import { useEffect, useMemo, useState } from "react";
import PredictionCard from "../components/PredictionCard";
import ProductCard from "../components/ProductCard";

function Recommendation() {
  const API_URL = "http://127.0.0.1:8000";

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [predictedCategories, setPredictedCategories] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_PER_PAGE = 20;

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch((err) => console.error(err));
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return products;

    return products.filter((product) => {
      const name = String(product.product_name || "").toLowerCase();
      const asin = String(product.parent_asin || "").toLowerCase();
      const kategori = String(product.kategori || "").toLowerCase();

      return (
        name.includes(keyword) ||
        asin.includes(keyword) ||
        kategori.includes(keyword)
      );
    });
  }, [search, products]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const addProduct = (productName) => {
    if (selectedProducts.includes(productName)) return;

    setSelectedProducts([...selectedProducts, productName]);
    setSearch("");
    setCurrentPage(1);
  };

  const removeProduct = (index) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const resetAll = () => {
    setSearch("");
    setSelectedProducts([]);
    setPredictedCategories([]);
    setRecommendations([]);
    setCurrentPage(1);
  };

  const getRecommendation = async () => {
    if (selectedProducts.length === 0) {
      alert("Pilih minimal satu produk terlebih dahulu.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          product_names: selectedProducts,
          top_n_category: 3,
          top_n_products: 5
        })
      });

      const data = await response.json();

      setPredictedCategories(data.predicted_categories || []);
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error(error);
      alert("Backend belum jalan atau endpoint bermasalah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <section className="page-header">
        <div>
          <h1>Recommendation</h1>
          <p>Cari produk, tambahkan ke histori, lalu prediksi rekomendasi.</p>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Cari Produk</h2>
            <p>
              Cari berdasarkan nama produk, kategori, atau ASIN. Data ditampilkan
              20 produk per halaman.
            </p>
          </div>

          <button className="outline" onClick={resetAll}>
            Reset
          </button>
        </div>

        <input
          className="search-input"
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div className="result-info">
          Menampilkan {currentProducts.length} dari {filteredProducts.length} produk
        </div>

        <div className="search-result">
          {currentProducts.length === 0 ? (
            <p className="empty">Produk tidak ditemukan.</p>
          ) : (
            currentProducts.map((product, index) => (
              <button
                key={`${product.parent_asin}-${index}`}
                className="search-item"
                onClick={() => addProduct(product.product_name)}
              >
                <strong>{product.product_name}</strong>
                <span>{product.kategori}</span>
                <small>{product.parent_asin}</small>
              </button>
            ))
          )}
        </div>

        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ← Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next →
          </button>
        </div>

        <div className="history">
          <h3>Riwayat Produk</h3>

          {selectedProducts.length === 0 ? (
            <p className="empty">Belum ada produk dipilih.</p>
          ) : (
            <div className="chips">
              {selectedProducts.map((item, index) => (
                <span className="chip" key={index}>
                  {item}
                  <button onClick={() => removeProduct(index)}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          className="primary-btn"
          onClick={getRecommendation}
          disabled={loading}
        >
          {loading ? "Memproses..." : "Prediksi Rekomendasi"}
        </button>
      </section>

      <section className="panel">
        <h2>Prediksi Kategori Berikutnya</h2>

        {predictedCategories.length === 0 ? (
          <p className="empty">Belum ada hasil prediksi.</p>
        ) : (
          <div className="category-grid">
            {predictedCategories.map((item, index) => (
              <PredictionCard key={index} item={item} index={index} />
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Produk Rekomendasi</h2>

        {recommendations.length === 0 ? (
          <p className="empty">Belum ada rekomendasi produk.</p>
        ) : (
          <div className="product-grid">
            {recommendations.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Recommendation;