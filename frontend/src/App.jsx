import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const isLoggedIn = localStorage.getItem("token");

  return (
    <Routes>
      <Route
        path="/"
        element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
      />

      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/" /> : <Login />}
      />

      <Route
        path="/register"
        element={isLoggedIn ? <Navigate to="/" /> : <Register />}
      />
    </Routes>
  );
}

export default App;