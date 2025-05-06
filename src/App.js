import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import ReportPage from "./pages/ReportsPage";
import AddMoviePage from "./pages/AddMoviePage";
import AddReviewPage from "./pages/AddReviewPage";
import YourStatsPage from "./pages/YourStatsPage";

function App() {
  return (
    <Router>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/add-movie" element={<AddMoviePage />} />
          <Route path="/add-review" element={<AddReviewPage />} />
          <Route path="/your-stats" element={<YourStatsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
