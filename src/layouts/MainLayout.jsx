import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function MainLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="topbar">
          <div>
            <h2>Fashion Recommendation System</h2>
            <p>GRU-based Next Category Purchase Prediction</p>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;