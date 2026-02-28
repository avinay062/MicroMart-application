import React, { useState, useEffect } from 'react';
import { productApi } from '../api';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [message, setMessage] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await productApi.getAll();
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreated = () => {
    setMessage('Product created successfully.');
    setShowCreateForm(false);
    fetchProducts();
  };

  return (
    <div className="min-h-[80vh] bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Products</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setShowCreateForm(false); setMessage(''); }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                !showCreateForm
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              List
            </button>
            <button
              type="button"
              onClick={() => { setShowCreateForm(true); setMessage(''); }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                showCreateForm
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Create product
            </button>
          </div>
        </div>

        {message && (
          <p className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">{message}</p>
        )}
        {error && (
          <p className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">{error}</p>
        )}

        {showCreateForm ? (
          <ProductForm onSuccess={handleCreated} onCancel={() => setShowCreateForm(false)} />
        ) : loading ? (
          <div className="text-center py-12 text-slate-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-white rounded-xl shadow-sm">
            No products yet. Create one to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
