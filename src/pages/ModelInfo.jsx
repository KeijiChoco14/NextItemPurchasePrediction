function ModelInfo() {
  return (
    <div className="page">
      <section className="page-header">
        <h1>Model Information</h1>
        <p>Informasi arsitektur model GRU yang digunakan.</p>
      </section>

      <section className="panel">
        <h2>Arsitektur Model</h2>

        <div className="architecture">
          <div>Input Sequence</div>
          <div>Embedding Layer</div>
          <div>GRU Layer</div>
          <div>Dropout</div>
          <div>Dense ReLU</div>
          <div>Softmax Output</div>
        </div>
      </section>

      <section className="panel">
        <h2>Hyperparameter</h2>

        <div className="info-grid">
          <div><span>Optimizer</span><strong>Adam</strong></div>
          <div><span>Loss</span><strong>Sparse Categorical Crossentropy</strong></div>
          <div><span>Epoch</span><strong>30</strong></div>
          <div><span>Batch Size</span><strong>64</strong></div>
          <div><span>Input</span><strong>Product History</strong></div>
          <div><span>Output</span><strong>Next Category</strong></div>
        </div>
      </section>
    </div>
  );
}

export default ModelInfo;