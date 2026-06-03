import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Recommendation from "./pages/Recommendation";
import ModelInfo from "./pages/ModelInfo";
import DatasetInfo from "./pages/DatasetInfo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="recommendation" element={<Recommendation />} />
          <Route path="model" element={<ModelInfo />} />
          <Route path="dataset" element={<DatasetInfo />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;