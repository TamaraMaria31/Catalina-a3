import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";

// Cada página é carregada só quando a pessoa a visita (a home entra direto para abrir mais rápido).
const ProductListing = lazy(() => import("../pages/ProductListing"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
const Cart = lazy(() => import("../pages/Cart"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const MyAccount = lazy(() => import("../pages/MyAccount"));
const WeddingList = lazy(() => import("../pages/WeddingList"));
const Planner = lazy(() => import("../pages/Planner"));
const Favorites = lazy(() => import("../pages/Favorites"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("../pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("../pages/admin/AdminOrders"));
const NotFound = lazy(() => import("../pages/NotFound"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/produtos" element={<ProductListing />} />
      <Route path="/produtos/:category" element={<ProductListing />} />
      <Route path="/produto/:id" element={<ProductDetail />} />
      <Route path="/carrinho" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="/minha-conta" element={<MyAccount />} />
      <Route path="/favoritos" element={<Favorites />} />
      <Route path="/lista-de-casamento" element={<WeddingList />} />
      <Route path="/lista-de-casamento/:slug" element={<WeddingList />} />
      <Route path="/planejador" element={<Planner />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/produtos" element={<AdminProducts />} />
      <Route path="/admin/pedidos" element={<AdminOrders />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
