import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { getToken } from "./api";

function Protected({ children }) {
  return getToken() ? children : <Navigate to="/signin" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={getToken() ? "/dashboard" : "/signin"} replace />} />
      <Route path="/signin" element={<Login />} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}
