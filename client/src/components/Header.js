import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { userApi } from '../api';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleLogout = async () => {
    setDropdownOpen(false);
    try {
      await userApi.logout();
      setUser?.(null);
      navigate('/', { replace: true });
    } catch (err) {
      setUser?.(null);
      navigate('/', { replace: true });
    }
  };

  return (
    <header className="bg-slate-900 text-white shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center h-14">
        <Link to={user ? '/products' : '/'} className="flex items-center gap-2 font-bold text-lg">
          <span className="bg-amber-500 text-slate-900 w-8 h-8 rounded-lg flex items-center justify-center text-sm">
            MM
          </span>
          MicroMart
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          {user && (
            <>
              <Link to="/products" className="text-slate-200 hover:text-white transition">
                Products
              </Link>
              <Link to="/cart" className="text-slate-200 hover:text-white transition">
                Cart
              </Link>
              <Link to="/orders" className="text-slate-200 hover:text-white transition">
                Orders
              </Link>
            </>
          )}
        </nav>
        <div className="relative">
          {user ? (
            <>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none rounded-full p-1 hover:bg-slate-800"
              >
                <span className="w-8 h-8 bg-amber-500 text-slate-900 rounded-full flex items-center justify-center font-semibold text-sm">
                  {user?.firstName?.[0] || 'U'}
                </span>
                <span className="hidden sm:inline text-slate-200">{user?.firstName || 'User'}</span>
              </button>
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    aria-hidden
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 bg-white text-slate-800 rounded-lg shadow-lg py-1 z-20 min-w-[120px]">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-slate-100 rounded"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <Link
              to="/"
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
