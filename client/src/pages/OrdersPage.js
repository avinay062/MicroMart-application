import React, { useState, useEffect } from 'react';
import { orderApi } from '../api';

/**
 * Orders page. Order service currently has stub implementations;
 * UI calls GET /orders/:id and shows placeholder when backend returns empty or errors.
 */
const OrdersPage = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lookupId, setLookupId] = useState('');

  const handleLookup = async (e) => {
    e?.preventDefault();
    const id = (orderId || lookupId).trim();
    if (!id) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await orderApi.getById(id);
      setOrder(res.data);
      setLookupId(id);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Order not found or service error');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-slate-50 py-8 px-4 dark:bg-slate-900">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 dark:text-slate-100">Orders</h1>
        <p className="text-slate-600 text-sm mb-4 dark:text-slate-300">
          Look up an order by ID (e.g. after checkout you may receive an order ID).
        </p>
        <form onSubmit={handleLookup} className="flex gap-2 mb-6">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Order ID"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-700 disabled:opacity-60"
          >
            {loading ? 'Looking up...' : 'Look up'}
          </button>
        </form>
        {error && (
          <p className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm dark:bg-red-900/30 dark:text-red-300">{error}</p>
        )}
        {order && (
          <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-slate-800 dark:shadow-slate-950/40">
            <h2 className="font-semibold text-slate-800 mb-2 dark:text-slate-100">Order details</h2>
            <pre className="text-sm text-slate-700 overflow-auto max-h-96 bg-slate-50 p-4 rounded-lg dark:bg-slate-900 dark:text-slate-200">
              {JSON.stringify(order, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
