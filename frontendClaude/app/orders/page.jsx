"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Package, AlertCircle, ChevronRight, Truck, CheckCircle2, Clock } from "lucide-react";
import { listOrders, formatPrice } from "@/lib/api";

function StatusBadge({ delivered }) {
  if (delivered) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/30">
        <CheckCircle2 size={12} /> Delivered
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
      <Clock size={12} /> Processing
    </span>
  );
}

export default function OrdersPage() {
  const [customerId, setCustomerId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [deliveredFilter, setDeliveredFilter] = useState("0");

  async function handleSearch(e) {
    e.preventDefault();
    if (!customerId.trim() && !searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 25 };
      if (customerId.trim()) params.customer_id = customerId.trim();
      if (searchQuery.trim()) params.query = searchQuery.trim();
      if (deliveredFilter !== "0") params.delivered = deliveredFilter;

      const data = await listOrders(params);
      const orderList = data?.data || data?.result?.data || data;
      setOrders(Array.isArray(orderList) ? orderList : []);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-base-100 min-h-screen">
      <section className="border-b border-base-300">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-brand-yellow" />
            <span className="text-xs font-body font-semibold uppercase tracking-[0.22em] text-brand-yellow">Order History</span>
          </div>
          <h1 className="heading-display text-4xl md:text-5xl text-base-content mb-2">
            Your <span className="text-brand-yellow">Orders</span>
          </h1>
          <p className="font-body text-base-content/60 max-w-lg">
            Look up your order history by customer ID, order number, registration number, or date.
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-10">
        {/* Search form */}
        <form onSubmit={handleSearch} className="card bg-base-200 border border-base-300 p-5 mb-8 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label py-1">
                <span className="label-text text-xs font-body uppercase tracking-wider text-base-content/50">Customer ID</span>
              </label>
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="e.g. 12345"
                className="input input-bordered w-full font-mono text-sm"
              />
            </div>
            <div>
              <label className="label py-1">
                <span className="label-text text-xs font-body uppercase tracking-wider text-base-content/50">Search</span>
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Order no., reg. no., brand, date..."
                className="input input-bordered w-full text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="label py-1">
                <span className="label-text text-xs font-body uppercase tracking-wider text-base-content/50">Status</span>
              </label>
              <select
                value={deliveredFilter}
                onChange={(e) => setDeliveredFilter(e.target.value)}
                className="select select-bordered select-sm font-body text-sm"
              >
                <option value="0">All Orders</option>
                <option value="1">Delivered</option>
                <option value="2">Not Delivered</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading || (!customerId.trim() && !searchQuery.trim())}
              className="btn gap-2 font-display tracking-widest uppercase text-sm"
              style={{ background: "#F5C518", color: "#000", border: "none" }}
            >
              {loading ? <span className="loading loading-spinner loading-sm" /> : <Search size={16} />}
              Search Orders
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-error mb-6 max-w-2xl">
            <AlertCircle size={16} />
            <span className="font-body text-sm">{error}</span>
          </div>
        )}

        {orders && orders.length === 0 && (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto mb-4 text-base-content/20" />
            <p className="font-display text-xl font-bold uppercase mb-2">No orders found</p>
            <p className="font-body text-base-content/50">Try a different customer ID or search query.</p>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div className="space-y-3 max-w-4xl">
            {orders.map((order, i) => {
              const orderId = order.id || order.order_id || order.orderId;
              const orderDate = order.created_at || order.date || order.createdAt;
              const isDelivered = order.delivered || order.is_delivered;
              const totalPrice = order.total || order.total_price || order.totalPrice;

              return (
                <div key={orderId || i} className="card bg-base-200 border border-base-300 hover:border-brand-yellow/40 transition-colors">
                  <div className="card-body p-4 flex-row items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 flex items-center justify-center flex-shrink-0">
                      <Truck size={18} className="text-brand-yellow" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-display font-bold text-sm">Order #{orderId}</p>
                        <StatusBadge delivered={isDelivered} />
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-body text-base-content/50">
                        {orderDate && <span>{new Date(orderDate).toLocaleDateString("sv-SE")}</span>}
                        {order.customer_name && <span>{order.customer_name}</span>}
                        {order.licenseplate && <span className="font-mono">{order.licenseplate}</span>}
                      </div>
                    </div>

                    {totalPrice && (
                      <p className="font-display font-bold text-brand-yellow text-lg flex-shrink-0">
                        {formatPrice(totalPrice)}
                      </p>
                    )}

                    <ChevronRight size={16} className="text-base-content/30 flex-shrink-0" />
                  </div>
                </div>
              );
            })}

            {/* Simple prev/next pagination */}
            <div className="flex justify-center gap-3 pt-4">
              <button
                className="btn btn-sm btn-ghost"
                disabled={page <= 1}
                onClick={() => { setPage(page - 1); handleSearch({ preventDefault: () => {} }); }}
              >
                Previous
              </button>
              <span className="btn btn-sm btn-ghost pointer-events-none font-mono">Page {page}</span>
              <button
                className="btn btn-sm btn-ghost"
                disabled={orders.length < 25}
                onClick={() => { setPage(page + 1); handleSearch({ preventDefault: () => {} }); }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
