function DatasetInfo() {
  return (
    <div className="page">
      <section className="page-header">
        <h1>Dataset Information</h1>
        <p>Informasi dataset fashion yang digunakan dalam sistem.</p>
      </section>

      <section className="panel">
        <h2>Fitur Dataset</h2>

        <div className="info-grid">
          <div><span>Product Name</span><strong>Nama produk</strong></div>
          <div><span>Parent ASIN</span><strong>ID produk</strong></div>
          <div><span>User ID</span><strong>ID pengguna</strong></div>
          <div><span>Timestamp</span><strong>Urutan waktu</strong></div>
          <div><span>Kategori</span><strong>Kategori produk</strong></div>
          <div><span>Rating</span><strong>Rating produk</strong></div>
          <div><span>Price</span><strong>Harga produk</strong></div>
          <div><span>Gender</span><strong>Segmentasi produk</strong></div>
          <div><span>Warna</span><strong>Warna produk</strong></div>
        </div>
      </section>

      <section className="panel">
        <h2>Penggunaan Dataset</h2>
        <p>
          Dataset digunakan untuk membentuk sequence histori produk berdasarkan
          user dan timestamp. Model GRU mempelajari urutan kategori produk
          tersebut untuk memprediksi kategori pembelian berikutnya.
        </p>
      </section>
    </div>
  );
}

export default DatasetInfo;