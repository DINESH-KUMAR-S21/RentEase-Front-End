import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from './Loader';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Show loader while auth is checking
  if (loading) {
    return <Loader />;
  }

  // If not authenticated, redirect to login with the attempted location saved
  if (!isAuthenticated) {
    localStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
