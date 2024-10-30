// src/client/frontend/src/App.tsx
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ReviewPage from "./features/ReviewPage";
import InterviewSimulationPage from "./features/SimulationPage";
import TopPage from "./features/TopPage";
import HistoryPage from "./features/HistoryPage.tsx";
import "./styles.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route
          path="/simulation"
          element={<InterviewSimulationPage />}
        />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
    </Router>
  );
};

export default App;

