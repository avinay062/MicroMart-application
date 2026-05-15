import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productApi } from '../api';
import { cartApi } from '../api';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchProduct = async () => {
      try {
        const res = await productApi.getById(id);
        if (!cancelled) setProduct(res.data);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || err?.message || 'Product not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProduct();
    return () => { cancelled = true; };
  }, [id]);

  const handleAddToCart = async () => {
    setCartMessage('');
    setAddingToCart(true);
    try {
      await cartApi.add(product._id || product.id, quantity);
      setCartMessage('Added to cart.');
    } catch (err) {
      setCartMessage(err?.response?.data?.message || err?.message || 'Could not add to cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <div className="min-h-[80vh] flex items-center justify-center text-slate-500 dark:text-slate-400">Loading...</div>;
  if (error || !product) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <p className="text-red-600 bg-red-50 px-4 py-2 rounded-lg dark:bg-red-900/30 dark:text-red-300">{error || 'Product not found'}</p>
      </div>
    );
  }

  const imageSrc = product.image
    ? `data:image/jpeg;base64,${product.image}`
    : 'https://via.placeholder.com/400x300?text=No+image';

  return (
    <div className="min-h-[80vh] bg-slate-50 py-8 px-4 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row dark:bg-slate-800 dark:shadow-slate-950/40">
        <div className="md:w-1/2 aspect-square md:aspect-auto md:min-h-[400px] bg-slate-100 dark:bg-slate-700">
          <img src={imageSrc} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="md:w-1/2 p-6 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{product.name}</h1>
          <p className="text-amber-600 text-xl font-semibold mt-2 dark:text-amber-400">${Number(product.price).toFixed(2)}</p>
          {product.description && (
            <p className="text-slate-600 mt-4 dark:text-slate-300">{product.description}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <label className="text-slate-700 dark:text-slate-200">Quantity:</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
              className="w-20 px-3 py-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-700 disabled:opacity-60"
            >
              {addingToCart ? 'Adding...' : 'Add to cart'}
            </button>
          </div>
          {cartMessage && (
            <p className={`mt-3 text-sm ${cartMessage.startsWith('Added') ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'}`}>
              {cartMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
