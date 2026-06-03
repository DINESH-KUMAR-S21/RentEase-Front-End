import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, restoreAuthFromStorage } from './redux/slices/authSlice';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Common
import ProtectedRoute from './components/common/ProtectedRoute';
import Loader from './components/common/Loader';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// User
import Profile from './pages/user/Profile';
import MyOrders from './pages/user/MyOrders';
import MyRentals from './pages/user/MyRentals';
import MaintenanceRequests from './pages/user/MaintenanceRequests';

// Vendor
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorProducts from './pages/vendor/VendorProducts';
import VendorDeliveries from './pages/vendor/VendorDeliveries';
import VendorMaintenance from './pages/vendor/VendorMaintenance';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminRentals from './pages/admin/AdminRentals';
import AdminLocations from './pages/admin/AdminLocations';
import AdminDisputes from './pages/admin/AdminDisputes';

function App() {
    const dispatch = useDispatch();
    const location = useLocation();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    useEffect(() => {
        // First, restore auth state from localStorage
        const savedAuth = localStorage.getItem('authState');
        if (savedAuth) {
            try {
                dispatch(restoreAuthFromStorage());
            } catch (error) {
                localStorage.removeItem('authState');
            }
        }

        // Then check for token and verify with backend
        const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = value;
            return acc;
        }, {});

        // Always try to load user if we have a token
        if (cookies.token) {
            dispatch(loadUser()).finally(() => {
                setInitialLoadComplete(true);
            });
        } else {
            // No token, just mark as complete
            setInitialLoadComplete(true);
        }
    }, [dispatch]);

    // Save current location when trying to access protected routes without auth
    useEffect(() => {
        if (initialLoadComplete && !isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/') {
            localStorage.setItem('lastLocation', location.pathname);
        }
    }, [location, isAuthenticated, initialLoadComplete]);

    // Show loader while checking auth on initial load
    if (!initialLoadComplete) {
        return <Loader />;
    }


  return (
    <>
      <Header />
      <Routes>

        {/* ─── Public Routes ─── */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        {/* ─── User Protected Routes ─── */}
        <Route element={<ProtectedRoute allowedRoles={["user", "vendor", "admin"]} />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders/me" element={<MyOrders />} />
          <Route path="/rentals/me" element={<MyRentals />} />
          <Route path="/maintenance/me" element={<MaintenanceRequests />} />
        </Route>

        {/* ─── Vendor Protected Routes ─── */}
        <Route element={<ProtectedRoute allowedRoles={["vendor"]} />}>
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/products" element={<VendorProducts />} />
          <Route path="/vendor/deliveries" element={<VendorDeliveries />} />
          <Route path="/vendor/maintenance" element={<VendorMaintenance />} />
        </Route>

        {/* ─── Admin Protected Routes ─── */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/rentals" element={<AdminRentals />} />
          <Route path="/admin/locations" element={<AdminLocations />} />
          <Route path="/admin/disputes" element={<AdminDisputes />} />
        </Route>

      </Routes>
      <Footer />
    </>
  );
}

export default App;