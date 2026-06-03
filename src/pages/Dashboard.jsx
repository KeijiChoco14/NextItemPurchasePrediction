import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";

function Dashboard() {
  const API_URL = "http://127.0.0.1:8000";
  const [stats, setStats] = useState({
    total_products: "-",
    total_categories: "-"
  });

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  return (
    <div className="page">
      <section className="hero-section">
        <div>
          <span className="tag">Deep Learning Project</span>
          <h1>Fashion Product Recommendation</h1>
          <p>
            Sistem rekomendasi produk fashion menggunakan model GRU untuk
            memprediksi kategori pembelian berikutnya berdasarkan histori produk
            pengguna.
          </p>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          title="Total Products"
          value={stats.total_products}
          subtitle="Produk tersedia di katalog"
        />
        <StatCard
          title="Categories"
          value={stats.total_categories}
          subtitle="Kategori produk fashion"
        />
        <StatCard
          title="Model"
          value="GRU"
          subtitle="Gated Recurrent Unit"
        />
        <StatCard
          title="Output"
          value="Top-N"
          subtitle="Recommendation result"
        />
      </section>

      <section className="panel">
        <h2>Alur Sistem</h2>

        <div className="flow-grid">
          <div>Input Product History</div>
          <div>Category Encoding</div>
          <div>GRU Prediction</div>
          <div>Product Recommendation</div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;