import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000";

const INITIAL_FORM = {
  name: "",
  weight: "",
  price: "",
  oldPrice: "",
  image: "",
  categories: "",
  featured: false,
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [saving, setSaving] = useState(false);

  // Load products and update results when search changes.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/api/products?search=${encodeURIComponent(search)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Products load nahi ho paaye.");
        }

        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, [search]);

  // Update form fields.
  function handleFormChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Create a product in MongoDB through the protected API.
  async function handleAddProduct(event) {
    event.preventDefault();

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      alert("Login token nahi mila. Please login again.");
      return;
    }

    const name = formData.name.trim();
    const price = Number(formData.price);

    if (!name || formData.price.trim() === "") {
      alert("Product name aur price required hain.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      alert("Valid product price enter karo.");
      return;
    }

    let oldPrice;

    if (formData.oldPrice.trim() !== "") {
      oldPrice = Number(formData.oldPrice);

      if (!Number.isFinite(oldPrice) || oldPrice < 0) {
        alert("Valid old price enter karo.");
        return;
      }
    }

    const payload = {
      name,
      weight: formData.weight.trim(),
      price,
      image: formData.image.trim(),
      categories: formData.categories
        .split(",")
        .map((category) => category.trim())
        .filter(Boolean),
      featured: formData.featured,
    };

    if (oldPrice !== undefined) {
      payload.oldPrice = oldPrice;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Product save nahi hua.");
      }

      // Add the saved product to the table.
      setProducts((previous) => {
        const updated = [result, ...previous];

        if (search.trim()) {
          return updated.filter((product) =>
            product.name?.toLowerCase().includes(search.trim().toLowerCase()),
          );
        }

        return updated;
      });

      setFormData({ ...INITIAL_FORM });
      setShowAddForm(false);
      alert("Product successfully added!");
    } catch (err) {
      alert(err.message || "Product save karte waqt error aaya.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your store products.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAddForm((previous) => !previous)}
            className="rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            {showAddForm ? "Cancel" : "+ Add Product"}
          </button>

          <div className="rounded-lg bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
            Total Products: {products.length}
          </div>
        </div>
      </div>

      {/* Add Product form */}
      {showAddForm && (
        <form
          onSubmit={handleAddProduct}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-slate-900">Add New Product</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              required
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Product name *"
              className="rounded-lg border border-slate-300 px-4 py-3 text-sm"
            />

            <input
              name="weight"
              value={formData.weight}
              onChange={handleFormChange}
              placeholder="Weight (e.g. 500g)"
              className="rounded-lg border border-slate-300 px-4 py-3 text-sm"
            />

            <input
              required
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleFormChange}
              placeholder="Price (₹) *"
              className="rounded-lg border border-slate-300 px-4 py-3 text-sm"
            />

            <input
              name="oldPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.oldPrice}
              onChange={handleFormChange}
              placeholder="Old price (₹)"
              className="rounded-lg border border-slate-300 px-4 py-3 text-sm"
            />

            <input
              name="image"
              type="url"
              value={formData.image}
              onChange={handleFormChange}
              placeholder="Product image URL (https://...)"
              className="rounded-lg border border-slate-300 px-4 py-3 text-sm sm:col-span-2"
            />

            <input
              name="categories"
              value={formData.categories}
              onChange={handleFormChange}
              placeholder="Categories (e.g. grocery, snacks)"
              className="rounded-lg border border-slate-300 px-4 py-3 text-sm sm:col-span-2"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              name="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={handleFormChange}
            />
            Featured product
          </label>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Product"}
          </button>
        </form>
      )}

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products by name..."
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </div>

      {/* Products table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-8 text-center text-slate-500">Loading products...</p>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => setSearch((previous) => `${previous}`)}
              className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
            >
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <p className="p-8 text-center text-slate-500">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Weight</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Old Price</th>
                  <th className="px-5 py-4">Category</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg border border-slate-100 object-contain"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                            No image
                          </div>
                        )}

                        <span className="font-medium text-slate-800">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {product.weight || "—"}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-800">
                      ₹{Number(product.price || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {product.oldPrice
                        ? `₹${Number(product.oldPrice).toLocaleString("en-IN")}`
                        : "—"}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {Array.isArray(product.categories)
                        ? product.categories.join(", ")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
