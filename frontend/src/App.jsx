import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Navbar from "./pages/navbar";

/* 🔐 Protected Route */
function PrivateRoute() {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" />;
}

/* 🧭 Navbar Wrapper */
function NavbarLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes WITH Navbar */}
        <Route element={<PrivateRoute />}>
          <Route element={<NavbarLayout />}>
            <Route path="/home" element={<Home />} />
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
