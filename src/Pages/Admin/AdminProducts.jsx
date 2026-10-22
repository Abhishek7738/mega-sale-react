import { useEffect, useRef, useState } from "react";

const API_BASE = "http://localhost:5000";

const INITIAL_FORM = {
  name: "",
  weight: "",
  price: "",
  oldPrice: "",
  image: "",
  categories: "",
  featured: false,
  isPremium: false,
  isNewLaunch: false,
  description: "",
  stock: "0",
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

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

  // Create a product with image upload through the protected API.
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
    const stock = Number(formData.stock);

    if (!name || formData.price.trim() === "") {
      alert("Product name aur price required hain.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      alert("Valid product price enter karo.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      alert("Stock non-negative whole number hona chahiye.");
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

    if (selectedImage && !selectedImage.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const payload = new FormData();

    payload.append("name", name);
    payload.append("weight", formData.weight.trim());
    payload.append("price", String(price));
    payload.append("categories", formData.categories);
    payload.append("featured", String(formData.featured));
    payload.append("isPremium", String(formData.isPremium));
    payload.append("isNewLaunch", String(formData.isNewLaunch));
    payload.append("description", formData.description);
    payload.append("stock", String(stock));

    if (oldPrice !== undefined) {
      payload.append("oldPrice", String(oldPrice));
    }

    if (selectedImage) {
      payload.append("image", selectedImage);
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Product save nahi hua.");
      }

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
      setSelectedImage(null);
      setImagePreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setShowAddForm(false);
      alert("Product successfully added!");
    } catch (err) {
      alert(err.message || "Product save karte waqt error aaya.");
    } finally {
      setSaving(false);
    }
  }

  // Delete product from MongoDB through the protected API.
  async function handleDeleteProduct(productId, productName) {
    const confirmed = window.confirm(
      `Kya tum "${productName}" ko delete karna chahte ho?`,
    );

    if (!confirmed) return;

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      alert("Login token nahi mila. Please login again.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Product delete nahi hua.");
      }

      setProducts((previous) =>
        previous.filter((product) => product._id !== productId),
      );

      alert("Product successfully deleted!");
    } catch (error) {
      alert(error.message || "Product delete karte waqt error aaya.");
    } finally {
      setSaving(false);
    }
  }

  // Update an existing product.
  async function handleEditProduct(event) {
    event.preventDefault();

    if (!editingProduct) return;

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      alert("Login token nahi mila. Please login again.");
      return;
    }

    const name = formData.name.trim();
    const price = Number(formData.price);
    const stock = Number(formData.stock);

    if (!name || formData.price.trim() === "") {
      alert("Product name aur price required hain.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      alert("Valid product price enter karo.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      alert("Stock non-negative whole number hona chahiye.");
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

    if (selectedImage && !selectedImage.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const payload = new FormData();

    payload.append("name", name);
    payload.append("weight", formData.weight.trim());
    payload.append("price", String(price));
    payload.append("categories", formData.categories);
    payload.append("featured", String(formData.featured));
    payload.append("isPremium", String(formData.isPremium));
    payload.append("isNewLaunch", String(formData.isNewLaunch));
    payload.append("description", formData.description);
    payload.append("stock", String(stock));

    if (oldPrice !== undefined) {
      payload.append("oldPrice", String(oldPrice));
    }

    if (selectedImage) {
      payload.append("image", selectedImage);
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_BASE}/api/products/${editingProduct._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Product update nahi hua.");
      }

      setProducts((previous) =>
        previous.map((product) =>
          product._id === editingProduct._id ? result : product,
        ),
      );

      setFormData({ ...INITIAL_FORM });
      setSelectedImage(null);
      setImagePreview("");
      setEditingProduct(null);
      setShowAddForm(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      alert("Product successfully updated!");
    } catch (error) {
      alert(error.message || "Product update karte waqt error aaya.");
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

      {/* Add / Edit Product Modal */}
      {showAddForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setShowAddForm(false);
              setEditingProduct(null);
            }
          }}
        >
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
            <button
              type="button"
              aria-label="Close product form"
              disabled={saving}
              onClick={() => {
                setShowAddForm(false);
                setEditingProduct(null);
              }}
              className="absolute right-5 top-5 rounded-lg px-3 py-1 text-2xl text-slate-500 hover:bg-slate-100"
            >
              ×
            </button>

            <h2 className="mb-6 pr-10 text-xl font-bold text-slate-900">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>

            <form
              onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Product name *"
                  className="min-w-0 rounded-lg border border-slate-300 px-4 py-3 text-sm"
                />

                <input
                  name="weight"
                  value={formData.weight}
                  onChange={handleFormChange}
                  placeholder="Weight (e.g. 500g)"
                  className="min-w-0 rounded-lg border border-slate-300 px-4 py-3 text-sm"
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
                  className="min-w-0 rounded-lg border border-slate-300 px-4 py-3 text-sm"
                />

                <input
                  name="oldPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.oldPrice}
                  onChange={handleFormChange}
                  placeholder="MRP (₹)"
                  className="min-w-0 rounded-lg border border-slate-300 px-4 py-3 text-sm"
                />

                <input
                  required
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.stock}
                  onChange={handleFormChange}
                  placeholder="Quantity in stock *"
                  className="min-w-0 rounded-lg border border-slate-300 px-4 py-3 text-sm"
                />

                <input
                  name="categories"
                  value={formData.categories}
                  onChange={handleFormChange}
                  placeholder="Categories (e.g. grocery, snacks)"
                  className="min-w-0 rounded-lg border border-slate-300 px-4 py-3 text-sm"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  Product Image
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;

                    if (!file.type.startsWith("image/")) {
                      alert("Please select a valid image file.");
                      event.target.value = "";
                      return;
                    }

                    setSelectedImage(file);
                    setImagePreview(URL.createObjectURL(file));
                  }}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
                />

                {imagePreview && (
                  <div className="flex items-center gap-4">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="h-24 w-24 rounded-lg border border-slate-200 object-contain"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview("");
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Remove image
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Product Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Describe your product..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-100 pt-4">
                {[
                  { name: "featured", label: "Featured product" },
                  { name: "isPremium", label: "Premium Product" },
                  { name: "isNewLaunch", label: "New Launch" },
                ].map((item) => (
                  <label
                    key={item.name}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <input
                      name={item.name}
                      type="checkbox"
                      checked={Boolean(formData[item.name])}
                      onChange={handleFormChange}
                    />
                    {item.label}
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                  }}
                  className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                      ? "Save Changes"
                      : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
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
                  <th className="px-5 py-4">MRP</th>
                  <th className="px-5 py-4">STOCK</th>
                  <th className="px-5 py-4">DESCRIPTION</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={
                              product.image?.startsWith("/uploads/")
                                ? `http://localhost:5000${product.image}`
                                : product.image
                            }
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
                    <td className="px-5 py-4">{product.stock ?? 0}</td>

                    <td className="px-5 py-4 max-w-xs">
                      <span
                        className="block truncate"
                        title={product.description || ""}
                      >
                        {product.description || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {Array.isArray(product.categories)
                        ? product.categories.join(", ")
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(product);
                            setFormData({
                              name: product.name || "",
                              weight: product.weight || "",
                              price: String(product.price ?? ""),
                              oldPrice:
                                product.oldPrice != null
                                  ? String(product.oldPrice)
                                  : "",
                              image: product.image || "",
                              categories: Array.isArray(product.categories)
                                ? product.categories.join(", ")
                                : "",
                              featured: Boolean(product.featured),
                              isPremium: Boolean(product.isPremium),
                              isNewLaunch: Boolean(product.isNewLaunch),
                              stock: String(product.stock ?? 0),
                            });

                            setSelectedImage(null);
                            setImagePreview(
                              product.image?.startsWith("/uploads/")
                                ? `${API_BASE}${product.image}`
                                : product.image || "",
                            );

                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }

                            setShowAddForm(true);
                          }}
                          className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteProduct(
                              product._id,
                              product.name || "this product",
                            )
                          }
                          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
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
