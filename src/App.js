import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import NavBar from "./components/Navbar";
import Budget from "./pages/Budget"

export default function App() {
  const [token, setToken] = React.useState(localStorage.getItem("token") || "");

  function handleLogin(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken("");
  }

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <NavBar onLogout={handleLogout}/>
      <Routes>
        <Route path="/dashboard" element={<Dashboard token={token} />} />
        <Route path="/transactions" element={<Transactions token={token} />} />
        <Route path="/budget" element={<Budget token={token} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
