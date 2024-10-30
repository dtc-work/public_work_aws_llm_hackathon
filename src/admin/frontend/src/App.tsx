// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "./features/AdminPage";
import AdminReviewPage from "./features/ReviewPage";
import "./styles.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/" element={<AdminPage />} />
        <Route path="/review" element={<AdminReviewPage />} />
      </Routes>
    </Router>
  );
};

export default App;
