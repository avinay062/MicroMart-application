import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { UserProvider, UserContext } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import { setUnauthorizedHandler } from './api';

const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const CartPage = React.lazy(() => import('./pages/CartPage'));
const OrdersPage = React.lazy(() => import('./pages/OrdersPage'));

function UnauthorizedHandler() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser?.(null);
      navigate('/', { replace: true });
    });
  }, [setUser, navigate]);
  return null;
}

const App = () => (
  <ThemeProvider>
    <UserProvider>
      <Router>
        <UnauthorizedHandler />
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
          <Header />
          <main className="flex-1">
            <React.Suspense fallback={
              <div className="flex items-center justify-center min-h-[60vh] text-slate-500 dark:text-slate-400">
                Loading...
              </div>
            }>
              <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route
                  path="/products"
                  element={
                    <ProtectedRoute>
                      <ProductsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products/:id"
                  element={
                    <ProtectedRoute>
                      <ProductDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/main" element={<Navigate to="/products" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </React.Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  </ThemeProvider>
);

export default App;
