import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cartApi } from '../api';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);

  const fetchCart = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await cartApi.get();
      const data = res.data;
      const cartData = data?.cart ?? data;
      setCart(cartData);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load cart');
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    setActionLoading(true);
    setError('');
    try {
      const res = await cartApi.update(productId, quantity);
      setCart(res.data?.cart ?? res.data);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Update failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    setActionLoading(true);
    setError('');
    try {
      const res = await cartApi.remove(productId);
      setCart(res.data?.cart ?? res.data);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Remove failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Clear entire cart?')) return;
    setActionLoading(true);
    setError('');
    try {
      await cartApi.clear();
      setCart(null);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Clear failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckout = async () => {
    setActionLoading(true);
    setError('');
    setCheckoutResult(null);
    try {
      const res = await cartApi.checkout();
      setCheckoutResult(res.data);
      setCart(null);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Checkout failed');
    } finally {
      setActionLoading(false);
    }
  };

  const items = cart?.items ?? (Array.isArray(cart) ? cart : []);
  const isEmpty = !items || items.length === 0;

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-slate-500">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Your cart</h1>
        {error && (
          <p className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">{error}</p>
        )}
        {checkoutResult && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-xl">
            <p className="font-medium">Checkout successful.</p>
            <pre className="mt-2 text-sm overflow-auto max-h-40">
              {JSON.stringify(checkoutResult, null, 2)}
            </pre>
          </div>
        )}
        {isEmpty && !checkoutResult ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-600">
            <p className="mb-4">Your cart is empty.</p>
            <Link to="/products" className="text-amber-600 font-medium hover:underline">
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.productId?._id || item.product?._id || item.productId || item._id}
                  item={item}
                  onUpdate={handleUpdateQuantity}
                  onRemove={handleRemove}
                  disabled={actionLoading}
                />
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCheckout}
                disabled={actionLoading || isEmpty}
                className="bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Checkout'}
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={actionLoading || isEmpty}
                className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >
                Clear cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

function CartItem({ item, onUpdate, onRemove, disabled }) {
  const product = item.productId || item.product || {};
  const productId = product._id || product.id || item.productId;
  const name = product.name || 'Product';
  const price = Number(product.price ?? item.price ?? 0);
  const qty = Number(item.quantity ?? 1);
  const imageSrc = product.image
    ? `data:image/jpeg;base64,${product.image}`
    : null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap items-center gap-4">
      {imageSrc && (
        <img src={imageSrc} alt={name} className="w-20 h-20 object-cover rounded-lg" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-800 truncate">{name}</p>
        <p className="text-amber-600">${price.toFixed(2)} each</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onUpdate(productId, qty - 1)}
          disabled={disabled || qty <= 1}
          className="w-8 h-8 rounded border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          −
        </button>
        <span className="w-8 text-center font-medium">{qty}</span>
        <button
          type="button"
          onClick={() => onUpdate(productId, qty + 1)}
          disabled={disabled}
          className="w-8 h-8 rounded border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          +
        </button>
      </div>
      <p className="font-medium text-slate-800">${(price * qty).toFixed(2)}</p>
      <button
        type="button"
        onClick={() => onRemove(productId)}
        disabled={disabled}
        className="text-red-600 text-sm hover:underline"
      >
        Remove
      </button>
    </div>
  );
}

export default CartPage;
