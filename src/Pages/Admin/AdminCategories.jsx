import { useEffect, useMemo, useRef, useState } from "react";

const PAGE_SIZE = 8;

const ICONS = [
  { name: "Laptop", className: "fa-solid fa-laptop" },
  { name: "Desktop", className: "fa-solid fa-desktop" },
  { name: "Mobile", className: "fa-solid fa-mobile-screen-button" },
  { name: "TV", className: "fa-solid fa-tv" },
  { name: "Headphones", className: "fa-solid fa-headphones" },
  { name: "Basketball", className: "fa-solid fa-basketball" },
  { name: "Football", className: "fa-solid fa-football" },
  { name: "Dumbbell", className: "fa-solid fa-dumbbell" },
  { name: "Shirt", className: "fa-solid fa-shirt" },
  { name: "Shoe", className: "fa-solid fa-shoe-prints" },
  { name: "Heart", className: "fa-solid fa-heart" },
  { name: "Leaf", className: "fa-solid fa-leaf" },
  { name: "Apple", className: "fa-solid fa-apple-whole" },
  { name: "Carrot", className: "fa-solid fa-carrot" },
  { name: "Basket", className: "fa-solid fa-basket-shopping" },
  { name: "Bottle", className: "fa-solid fa-bottle-water" },
  { name: "Coffee", className: "fa-solid fa-mug-hot" },
  { name: "Gift", className: "fa-solid fa-gift" },
  { name: "Book", className: "fa-solid fa-book" },
  { name: "Paw", className: "fa-solid fa-paw" },
  { name: "Baby", className: "fa-solid fa-baby" },
  { name: "Car", className: "fa-solid fa-car" },
  { name: "Tools", className: "fa-solid fa-screwdriver-wrench" },
  { name: "Store", className: "fa-solid fa-store" },
];

const INITIAL_CATEGORIES = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    description: "Electronic devices and accessories",
    image: "/Electronics1.png",
    icon: "fa-solid fa-laptop",
    status: "Active",
    products: 24,
    createdAt: "2024-10-01",
  },
  {
    id: 2,
    name: "Sports",
    slug: "sports",
    description: "Sports equipment and accessories",
    image: "/Sports1.png",
    icon: "fa-solid fa-basketball",
    status: "Active",
    products: 18,
    createdAt: "2024-10-01",
  },
  {
    id: 3,
    name: "Accessorise",
    slug: "accessorise",
    description: "Everyday accessories",
    image: "/Accessorise1.jpg",
    icon: "fa-solid fa-bag-shopping",
    status: "Active",
    products: 15,
    createdAt: "2024-09-28",
  },
  {
    id: 4,
    name: "Fashion",
    slug: "fashion",
    description: "Fashion and clothing",
    image: "/Fashion1.png",
    icon: "fa-solid fa-shirt",
    status: "Active",
    products: 32,
    createdAt: "2024-09-25",
  },
  {
    id: 5,
    name: "Beauty",
    slug: "beauty",
    description: "Beauty and personal care",
    image: "/Beauty.png",
    icon: "fa-solid fa-heart",
    status: "Active",
    products: 28,
    createdAt: "2024-09-20",
  },
  {
    id: 6,
    name: "Grocery & Food",
    slug: "grocery-food",
    description: "Daily grocery and food products",
    image: "/Grocery & Food1.png",
    icon: "fa-solid fa-basket-shopping",
    status: "Active",
    products: 40,
    createdAt: "2024-09-18",
  },
  {
    id: 7,
    name: "Beverages",
    slug: "beverages",
    description: "Drinks and beverages",
    image: "/Beverages1.png",
    icon: "fa-solid fa-bottle-water",
    status: "Inactive",
    products: 12,
    createdAt: "2024-09-15",
  },
  {
    id: 8,
    name: "Vegetables & Fruits",
    slug: "vegetables-fruits",
    description: "Fresh fruits and vegetables",
    image: "/Vegetables & Fruits1.png",
    icon: "fa-solid fa-leaf",
    status: "Active",
    products: 26,
    createdAt: "2024-09-12",
  },
  {
    id: 9,
    name: "Dry Fruits",
    slug: "dry-fruits",
    description: "Premium dry fruits and nuts",
    image: "",
    icon: "fa-solid fa-seedling",
    status: "Active",
    products: 8,
    createdAt: "2024-09-10",
  },
  {
    id: 10,
    name: "Dairy Products",
    slug: "dairy-products",
    description: "Milk and dairy products",
    image: "",
    icon: "fa-solid fa-bottle-water",
    status: "Active",
    products: 10,
    createdAt: "2024-09-08",
  },
  {
    id: 11,
    name: "Bakery",
    slug: "bakery",
    description: "Fresh bakery products",
    image: "",
    icon: "fa-solid fa-bread-slice",
    status: "Inactive",
    products: 6,
    createdAt: "2024-09-05",
  },
  {
    id: 12,
    name: "Personal Care",
    slug: "personal-care",
    description: "Personal hygiene and care products",
    image: "",
    icon: "fa-solid fa-heart",
    status: "Active",
    products: 9,
    createdAt: "2024-09-01",
  },
];

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  image: "",
  icon: "fa-solid fa-leaf",
  status: "Active",
};

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatCard({ title, value, subtitle, icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${color}`}
        >
          <i className={`${icon} text-2xl`} aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function CategoryModal({ editingCategory, categories, onClose, onSave }) {
  const [form, setForm] = useState(() =>
    editingCategory
      ? {
          name: editingCategory.name,
          slug: editingCategory.slug,
          description: editingCategory.description,
          image: editingCategory.image,
          icon: editingCategory.icon,
          status: editingCategory.status,
        }
      : { ...EMPTY_FORM },
  );

  const [iconSearch, setIconSearch] = useState("");
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [imageError, setImageError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [slugEdited, setSlugEdited] = useState(Boolean(editingCategory));
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const filteredIcons = ICONS.filter((icon) =>
    icon.name.toLowerCase().includes(iconSearch.toLowerCase()),
  );

  const updateField = (field, value) => {
    setForm((previous) => {
      const updated = { ...previous, [field]: value };

      if (field === "name" && !slugEdited) {
        updated.slug = createSlug(value);
      }

      return updated;
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setImageError("Please select a JPG or PNG image.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError("Image size must be 2 MB or less.");
      event.target.value = "";
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;

    setImageError("");
    setForm((previous) => ({
      ...previous,
      image: previewUrl,
      imageFile: file,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSaveError("");

    const name = form.name.trim();
    const slug = createSlug(form.slug);

    if (!name || !slug) {
      setSaveError("Category name and slug are required.");
      return;
    }

    const duplicate = categories.some(
      (category) =>
        category.id !== editingCategory?.id &&
        (category.name.toLowerCase() === name.toLowerCase() ||
          category.slug.toLowerCase() === slug.toLowerCase()),
    );

    if (duplicate) {
      setSaveError("A category with this name or slug already exists.");
      return;
    }

    onSave({
      ...form,
      name,
      slug,
      image: form.image,
    });
  };

  return (
    <>
      <button
        type="button"
        aria-label="Close category form"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/40"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-form-title"
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2
              id="category-form-title"
              className="text-xl font-bold text-slate-900"
            >
              {editingCategory ? "Edit Category" : "Add Category"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter the category details below.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-2xl text-slate-400 hover:bg-slate-100"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-5 overflow-y-auto p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Category Name <span className="text-red-500">*</span>
            </label>

            <input
              autoFocus
              required
              maxLength={80}
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="e.g. Fresh Fruits"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Slug <span className="text-red-500">*</span>
            </label>

            <input
              required
              maxLength={100}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              title="Use lowercase letters, numbers and hyphens."
              value={form.slug}
              onChange={(event) => {
                setSlugEdited(true);
                updateField("slug", event.target.value);
              }}
              placeholder="e.g. fresh-fruits"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-2 text-xs text-slate-500">
              Lowercase letters, numbers and hyphens only.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Description
            </label>

            <textarea
              rows={3}
              maxLength={300}
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Brief description about this category..."
              className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Category Image
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex min-h-36 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center transition hover:border-blue-400 hover:bg-blue-50/50"
            >
              {form.image ? (
                <img
                  src={
                    form.image?.startsWith("blob:") ||
                    form.image?.startsWith("data:")
                      ? form.image
                      : form.image?.startsWith("/uploads/")
                        ? `http://localhost:5000${form.image}`
                        : form.image
                  }
                  alt="Category preview"
                  className="mb-3 h-24 w-full object-contain"
                />
              ) : (
                <i className="fa-regular fa-images mb-3 text-3xl text-slate-500" />
              )}

              <span className="text-sm font-medium text-slate-700">
                {form.image ? "Change image" : "Click to upload image"}
              </span>
              <span className="mt-1 text-xs text-slate-500">
                JPG or PNG · Max 2 MB
              </span>
            </button>

            {imageError && (
              <p className="mt-2 text-sm text-red-600">{imageError}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Category Icon <span className="text-red-500">*</span>
            </label>

            <button
              type="button"
              onClick={() => setIconPickerOpen((previous) => !previous)}
              aria-expanded={iconPickerOpen}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-300 px-4 py-3 text-left transition hover:border-blue-400"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xl text-blue-600">
                <i className={form.icon} aria-hidden="true" />
              </span>

              <span className="flex-1">
                <span className="block text-sm font-semibold text-slate-800">
                  Choose an icon
                </span>
                <span className="mt-1 block break-all text-xs text-slate-500">
                  {form.icon}
                </span>
              </span>

              <i
                className={`fa-solid ${
                  iconPickerOpen ? "fa-chevron-up" : "fa-chevron-down"
                } text-slate-400`}
              />
            </button>

            {iconPickerOpen && (
              <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    autoFocus
                    value={iconSearch}
                    onChange={(event) => setIconSearch(event.target.value)}
                    placeholder="Search icons..."
                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div className="mt-3 grid max-h-48 grid-cols-5 gap-2 overflow-y-auto">
                  {filteredIcons.map((icon) => {
                    const selected = form.icon === icon.className;

                    return (
                      <button
                        key={icon.className}
                        type="button"
                        title={icon.name}
                        aria-label={icon.name}
                        aria-pressed={selected}
                        onClick={() => {
                          updateField("icon", icon.className);
                          setIconPickerOpen(false);
                          setIconSearch("");
                        }}
                        className={`flex h-12 flex-col items-center justify-center gap-1 rounded-lg border transition ${
                          selected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50"
                        }`}
                      >
                        <i className={`${icon.className} text-lg`} />
                      </button>
                    );
                  })}
                </div>

                {filteredIcons.length === 0 && (
                  <p className="py-5 text-center text-sm text-slate-500">
                    No matching icons found.
                  </p>
                )}

                <p className="mt-3 text-xs text-slate-500">
                  Selected: {form.icon}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Status
            </label>

            <select
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {saveError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {saveError}
            </p>
          )}

          <div className="flex gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              {editingCategory ? "Update Category" : "Save Category"}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryError, setCategoryError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const getAuthToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchCategories = async () => {
    setLoading(true);
    setCategoryError("");

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Please log in again to manage categories.");
      }

      const response = await fetch(
        "http://localhost:5000/api/admin/categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load categories.");
      }

      const normalizedCategories = data.map((category) => ({
        ...category,
        id: category._id,
        products: category.products ?? 0,
      }));

      setCategories(normalizedCategories);
      console.log("Categories loaded from MongoDB:", normalizedCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategoryError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const activeCount = categories.filter(
    (category) => category.status === "Active",
  ).length;

  const inactiveCount = categories.length - activeCount;

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories
      .filter((category) => {
        const matchesSearch =
          category.name.toLowerCase().includes(query) ||
          category.slug.toLowerCase().includes(query) ||
          category.description.toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === "All" || category.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        if (sortBy === "name-desc") return b.name.localeCompare(a.name);

        return sortBy === "newest"
          ? b.createdAt.localeCompare(a.createdAt)
          : a.createdAt.localeCompare(b.createdAt);
      });
  }, [categories, search, statusFilter, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / PAGE_SIZE),
  );

  const safePage = Math.min(currentPage, totalPages);

  const pageCategories = filteredCategories.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortBy]);

  const openAddModal = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const saveCategory = async (form) => {
    try {
      const token = getAuthToken();

      if (!token) {
        alert("Please log in again to manage categories.");
        return;
      }

      const isEditing = Boolean(editingCategory);

      const url = isEditing
        ? `http://localhost:5000/api/categories/${editingCategory.id}`
        : "http://localhost:5000/api/categories";

      const formData = new FormData();

      formData.append("name", form.name || "");
      formData.append("slug", form.slug || "");
      formData.append("description", form.description || "");
      formData.append("icon", form.icon || "fa-tag");
      formData.append("status", form.status || "Active");

      if (form.imageFile instanceof File) {
        formData.append("image", form.imageFile);
      } else if (form.image && !form.image.startsWith("blob:")) {
        formData.append("image", form.image);
      }

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save category.");
      }

      await fetchCategories();

      setCurrentPage(1);
      closeModal();
    } catch (error) {
      console.error("Error saving category:", error);
      alert(error.message || "Failed to save category.");
    }
  };

  const deleteCategory = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`,
    );

    if (!confirmed) return;

    try {
      const token = getAuthToken();

      if (!token) {
        alert("Please log in again to manage categories.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/categories/${category.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete category.");
      }

      setCategories((previous) =>
        previous.filter((item) => item.id !== category.id),
      );

      setSelectedIds((previous) => previous.filter((id) => id !== category.id));

      alert("Category deleted successfully.");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(error.message || "Failed to delete category.");
    }
  };
  const toggleSelected = (id) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((selectedId) => selectedId !== id)
        : [...previous, id],
    );
  };

  const allPageSelected =
    pageCategories.length > 0 &&
    pageCategories.every((category) => selectedIds.includes(category.id));

  const toggleSelectPage = () => {
    if (allPageSelected) {
      setSelectedIds((previous) =>
        previous.filter(
          (id) => !pageCategories.some((category) => category.id === id),
        ),
      );
    } else {
      setSelectedIds((previous) => [
        ...new Set([
          ...previous,
          ...pageCategories.map((category) => category.id),
        ]),
      ]);
    }
  };

  const bulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = window.confirm(
      `Delete ${selectedIds.length} selected categories? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      const token = getAuthToken();

      const response = await fetch(
        "http://localhost:5000/api/categories/bulk-delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ids: selectedIds }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete categories.");
      }

      await fetchCategories();
      setSelectedIds([]);

      alert(data.message || "Selected categories deleted successfully.");
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert(error.message || "Error deleting selected categories.");
    }
  };

  return (
    <div className="min-w-0 space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-500">RUROO MegaSale / Admin</p>
          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            Category Management
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Organize and manage your store categories. Add, edit or remove
            categories to keep your store organized.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          <i className="fa-solid fa-plus" aria-hidden="true" />
          Add Category
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Categories"
          value={categories.length}
          subtitle="All category items"
          icon="fa-solid fa-list"
          color="bg-orange-100 text-orange-600"
        />

        <StatCard
          title="Active Categories"
          value={activeCount}
          subtitle="Currently active"
          icon="fa-solid fa-circle-check"
          color="bg-green-100 text-green-700"
        />

        <StatCard
          title="Inactive Categories"
          value={inactiveCount}
          subtitle="Temporarily disabled"
          icon="fa-solid fa-ban"
          color="bg-red-100 text-red-600"
        />
      </div>

      {/* Table and filters */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 xl:flex-row">
          <div className="relative min-w-0 flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories by name or description..."
              className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
              className="min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 sm:min-w-40"
            >
              <option value="All">Status: All</option>
              <option value="Active">Status: Active</option>
              <option value="Inactive">Status: Inactive</option>
            </select>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort categories"
              className="min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 sm:min-w-44"
            >
              <option value="newest">Sort By: Newest</option>
              <option value="oldest">Sort By: Oldest</option>
              <option value="name-asc">Name: A–Z</option>
              <option value="name-desc">Name: Z–A</option>
            </select>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 bg-blue-50 px-5 py-3">
            <p className="text-sm font-medium text-blue-800">
              {selectedIds.length} categories selected
            </p>

            <button
              type="button"
              onClick={bulkDelete}
              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Delete Selected
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="w-12 px-5 py-4">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={toggleSelectPage}
                    aria-label="Select all categories on this page"
                    className="h-4 w-4 accent-blue-600"
                  />
                </th>
                <th className="px-3 py-4 font-semibold">Image</th>
                <th className="px-3 py-4 font-semibold">Category Name</th>
                <th className="px-3 py-4 font-semibold">Slug</th>
                <th className="px-3 py-4 font-semibold">Products</th>
                <th className="px-3 py-4 font-semibold">Status</th>
                <th className="px-3 py-4 font-semibold">Created Date</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {pageCategories.map((category) => (
                <tr
                  key={category.id}
                  className="transition hover:bg-slate-50/80"
                >
                  <td className="px-5 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(category.id)}
                      onChange={() => toggleSelected(category.id)}
                      aria-label={`Select ${category.name}`}
                      className="h-4 w-4 accent-blue-600"
                    />
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex h-12 w-14 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                      {category.image ? (
                        <img
                          src={
                            category.image?.startsWith("/uploads/")
                              ? `http://localhost:5000${category.image}`
                              : category.image
                          }
                          alt={category.name}
                          className="h-full w-full object-contain"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <i
                          className={`${category.icon} text-xl text-slate-400`}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                      <i
                        className={`${category.icon} text-slate-400`}
                        aria-hidden="true"
                      />
                      {category.name}
                    </div>
                  </td>

                  <td className="px-3 py-3 text-slate-500">{category.slug}</td>

                  <td className="px-3 py-3 text-slate-600">
                    {category.products}
                  </td>

                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        category.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {category.status}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 text-slate-500">
                    {formatDate(category.createdAt)}
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(category)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-300 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                      >
                        <i className="fa-solid fa-pen" aria-hidden="true" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteCategory(category)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <i
                          className="fa-regular fa-trash-can"
                          aria-hidden="true"
                        />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {pageCategories.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <i className="fa-solid fa-folder-open text-3xl text-slate-300" />
                    <p className="mt-3 font-semibold text-slate-700">
                      No categories found
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Try another search or change the status filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            {filteredCategories.length === 0
              ? 0
              : (safePage - 1) * PAGE_SIZE + 1}
            –{Math.min(safePage * PAGE_SIZE, filteredCategories.length)} of{" "}
            {filteredCategories.length} categories
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  aria-current={safePage === page ? "page" : undefined}
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold ${
                    safePage === page
                      ? "bg-blue-600 text-white"
                      : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {modalOpen && (
        <CategoryModal
          key={editingCategory?.id ?? "new-category"}
          editingCategory={editingCategory}
          categories={categories}
          onClose={closeModal}
          onSave={saveCategory}
        />
      )}
    </div>
  );
}
