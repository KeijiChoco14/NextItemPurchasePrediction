function PredictionCard({ item, index }) {
  return (
    <div className="prediction-card">
      <span>#{index + 1}</span>
      <h3>{item.kategori}</h3>
      <p>{item.score}%</p>
    </div>
  );
}

export default PredictionCard;