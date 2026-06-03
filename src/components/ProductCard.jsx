function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image">
        {product.kategori?.charAt(0)?.toUpperCase()}
      </div>

      <div className="product-content">
        <div className="product-meta">
          <span>{product.kategori}</span>
          <strong>{product.score}%</strong>
        </div>

        <h3>{product.product_name}</h3>
        <p className="asin">{product.parent_asin}</p>

        <div className="details">
          <p>⭐ {product.rating}</p>
          <p>${product.price}</p>
          <p>{product.gender}</p>
          <p>{product.warna}</p>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;