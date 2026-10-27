import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:5000";
const LOW_STOCK_LIMIT = 5;

function getStockStatus(stock) {
  const quantity = Number(stock ?? 0);

  if (quantity <= 0) {
    return {
      label: "Out of Stock",
      className: "bg-red-50 text-red-600",
    };
  }

  if (quantity <= LOW_STOCK_LIMIT) {
    return {
      label: "Low Stock",
      className: "bg-orange-50 text-orange-700",
    };
  }

  return {
    label: "In Stock",
    className: "bg-emerald-50 text-emerald-700",
  };
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${color}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateType, setUpdateType] = useState("add");
  const [quantity, setQuantity] = useState("1");

  // Load products from the existing products API.
  async function fetchProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/api/products`);

      if (!response.ok) {
        throw new Error("Products load nahi ho paaye.");
      }

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // Summary counts.
  const summary = useMemo(() => {
    const inStock = products.filter(
      (product) => Number(product.stock ?? 0) > LOW_STOCK_LIMIT,
    ).length;

    const lowStock = products.filter((product) => {
      const stock = Number(product.stock ?? 0);
      return stock >= 1 && stock <= LOW_STOCK_LIMIT;
    }).length;

    const outOfStock = products.filter(
      (product) => Number(product.stock ?? 0) <= 0,
    ).length;

    return {
      total: products.length,
      inStock,
      lowStock,
      outOfStock,
    };
  }, [products]);

  // Categories available in the product database.
  const categories = useMemo(() => {
    return [
      ...new Set(
        products.flatMap((product) =>
          Array.isArray(product.categories)
            ? product.categories
            : product.categories
              ? [product.categories]
              : [],
        ),
      ),
    ].sort();
  }, [products]);

  // Search and filter products.
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(search.trim().toLowerCase());

      const productCategories = Array.isArray(product.categories)
        ? product.categories
        : product.categories
          ? [product.categories]
          : [];

      const matchesCategory =
        category === "all" || productCategories.includes(category);

      const stock = Number(product.stock ?? 0);

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in" && stock > LOW_STOCK_LIMIT) ||
        (stockFilter === "low" && stock >= 1 && stock <= LOW_STOCK_LIMIT) ||
        (stockFilter === "out" && stock <= 0);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, category, stockFilter]);

  function openStockModal(product) {
    setSelectedProduct(product);
    setUpdateType("add");
    setQuantity("1");
  }

  function closeStockModal() {
    setSelectedProduct(null);
    setQuantity("1");
  }

  // UI preview only. This does not save stock to MongoDB.
  async function handleStockPreview(event) {
    event.preventDefault();

    const amount = Number(quantity);
    const currentStock = Number(selectedProduct?.stock ?? 0);

    if (!Number.isSafeInteger(amount) || amount <= 0) {
      alert("Quantity 1 ya usse zyada whole number honi chahiye.");
      return;
    }

    if (updateType === "remove" && amount > currentStock) {
      alert("Available stock se zyada quantity remove nahi kar sakte.");
      return;
    }

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      alert("Login session nahi mila. Please dobara login karo.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${selectedProduct._id}/stock`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action: updateType,
            quantity: amount,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Stock update failed.");
      }

      setProducts((previous) =>
        previous.map((product) =>
          product._id === data.productId
            ? { ...product, stock: data.stock }
            : product,
        ),
      );

      closeStockModal();

      alert(
        `${data.name} ka stock successfully update ho gaya. New stock: ${data.stock} units.`,
      );
    } catch (error) {
      console.error("Inventory stock update error:", error);
      alert(error.message || "Stock update nahi ho saka.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Inventory Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track and manage your product stock levels.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={fetchProducts}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            ↻ Refresh
          </button>

          <button
            type="button"
            onClick={() => {
              if (products.length > 0) {
                openStockModal(products[0]);
              }
            }}
            disabled={loading || products.length === 0}
            className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
          >
            + Update Stock
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Products"
          value={summary.total}
          icon="▦"
          color="bg-orange-50 text-orange-600"
        />

        <StatCard
          title="In Stock"
          value={summary.inStock}
          icon="▣"
          color="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Low Stock (≤ 5)"
          value={summary.lowStock}
          icon="⚠"
          color="bg-orange-50 text-orange-600"
        />

        <StatCard
          title="Out of Stock"
          value={summary.outOfStock}
          icon="⊘"
          color="bg-red-50 text-red-600"
        />
      </div>

      {/* Stock alerts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-orange-200 bg-orange-50/70 p-5 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-bold text-orange-700">⚠ Low Stock Alert</h3>

            <p className="mt-1 text-sm text-slate-600">
              {summary.lowStock} products have 5 units or less.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setStockFilter("low")}
            className="whitespace-nowrap rounded-lg bg-orange-100 px-4 py-2.5 text-sm font-semibold text-orange-700 hover:bg-orange-200"
          >
            View Products →
          </button>
        </div>

        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-red-200 bg-red-50/70 p-5 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-bold text-red-700">⊘ Out of Stock Alert</h3>

            <p className="mt-1 text-sm text-slate-600">
              {summary.outOfStock} products are currently out of stock.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setStockFilter("out")}
            className="whitespace-nowrap rounded-lg bg-red-100 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-200"
          >
            View Products →
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_auto]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="⌕ Search products by name..."
          className="min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
        >
          <option value="all">All Categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={stockFilter}
          onChange={(event) => setStockFilter(event.target.value)}
          className="min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
        >
          <option value="all">All Stock Status</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setSearch("");
            setCategory("all");
            setStockFilter("all");
          }}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Clear Filters
        </button>
      </div>

      {/* Inventory table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-900">Product Inventory</h2>

            <p className="mt-1 text-xs text-slate-500">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            Loading inventory...
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={fetchProducts}
              className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No products found.
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="grid grid-cols-1 gap-3 p-4 lg:hidden">
              {filteredProducts.map((product) => {
                const stock = Number(product.stock ?? 0);
                const status = getStockStatus(stock);

                return (
                  <div
                    key={product._id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img
                          src={
                            product.image.startsWith("/uploads/")
                              ? `${API_BASE}${product.image}`
                              : product.image
                          }
                          alt={product.name}
                          className="h-16 w-16 shrink-0 rounded-lg border border-slate-100 object-contain"
                        />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                          No image
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="break-words font-semibold text-slate-900">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {Array.isArray(product.categories)
                            ? product.categories.join(", ") || "Uncategorized"
                            : product.categories || "Uncategorized"}
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                          ₹{Number(product.price || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                      <div>
                        <p className="text-xs text-slate-500">
                          Available Stock
                        </p>
                        <p className="mt-1 font-bold text-slate-900">
                          {stock} units
                        </p>
                        <span
                          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => openStockModal(product)}
                        className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:border-orange-300 hover:text-orange-600"
                      >
                        Update Stock
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">#</th>
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Price (₹)</th>
                    <th className="px-5 py-4">Stock</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product, index) => {
                    const stock = Number(product.stock ?? 0);
                    const status = getStockStatus(stock);

                    const productCategories = Array.isArray(product.categories)
                      ? product.categories.join(", ")
                      : product.categories || "—";

                    return (
                      <tr
                        key={product._id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="px-5 py-4 text-slate-500">
                          {index + 1}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {product.image ? (
                              <img
                                src={
                                  product.image.startsWith("/uploads/")
                                    ? `${API_BASE}${product.image}`
                                    : product.image
                                }
                                alt={product.name}
                                className="h-12 w-12 shrink-0 rounded-lg border border-slate-100 bg-white object-contain p-1"
                              />
                            ) : (
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                                No image
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="max-w-56 break-words font-semibold text-slate-900">
                                {product.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {product.weight || "Weight not specified"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {productCategories}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">
                          {Number(product.price || 0).toLocaleString("en-IN")}
                        </td>

                        <td
                          className={`px-5 py-4 font-semibold ${
                            stock === 0
                              ? "text-red-600"
                              : stock <= LOW_STOCK_LIMIT
                                ? "text-orange-600"
                                : "text-slate-800"
                          }`}
                        >
                          {stock}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => openStockModal(product)}
                            className="whitespace-nowrap rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                          >
                            Update Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Update stock modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeStockModal();
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Update Stock</h2>

              <button
                type="button"
                onClick={closeStockModal}
                aria-label="Close stock modal"
                className="rounded-lg px-3 py-1 text-2xl text-slate-500 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3">
              {selectedProduct.image ? (
                <img
                  src={
                    selectedProduct.image.startsWith("/uploads/")
                      ? `${API_BASE}${selectedProduct.image}`
                      : selectedProduct.image
                  }
                  alt={selectedProduct.name}
                  className="h-16 w-16 rounded-xl border border-slate-100 object-contain p-1"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400">
                  No image
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h3 className="break-words font-semibold text-slate-900">
                  {selectedProduct.name}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedProduct.weight || "Weight not specified"}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
              Current Stock: {Number(selectedProduct.stock ?? 0)} units
            </div>

            <form onSubmit={handleStockPreview} className="mt-5 space-y-5">
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-800">
                  Update Type
                </p>

                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="updateType"
                      value="add"
                      checked={updateType === "add"}
                      onChange={(event) => setUpdateType(event.target.value)}
                      className="h-4 w-4 accent-orange-500"
                    />
                    Add Stock (Increase)
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="updateType"
                      value="remove"
                      checked={updateType === "remove"}
                      onChange={(event) => setUpdateType(event.target.value)}
                      className="h-4 w-4 accent-orange-500"
                    />
                    Remove Stock (Decrease)
                  </label>
                </div>
              </div>

              <div>
                <label
                  htmlFor="stockQuantity"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Quantity
                </label>

                <input
                  id="stockQuantity"
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />

                <p className="mt-2 text-xs text-slate-500">
                  New stock:{" "}
                  {Math.max(
                    0,
                    Number(selectedProduct.stock ?? 0) +
                      (updateType === "add"
                        ? Number(quantity || 0)
                        : -Number(quantity || 0)),
                  )}{" "}
                  units
                </p>
              </div>

              <div className="flex gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeStockModal}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
