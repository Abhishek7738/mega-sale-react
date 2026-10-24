import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000";

function getImageUrl(image) {
  if (!image) return "";
  if (image.startsWith("http")) return image;

  // Uploaded product images are stored on the backend.
  if (image.startsWith("/uploads/")) {
    return `${API_URL}${image}`;
  }

  // Images inside the frontend public folder.
  return image.startsWith("/") ? image : `/${image}`;
}

export default function AdminPremium() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);

        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected product data received.");
        }

        setProducts(data);
      } catch (err) {
        setError(err.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const premiumProducts = useMemo(() => {
    return products.filter((product) => {
      const isPremium =
        product.isPremium === true || product.isPremium === "true";

      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(search.trim().toLowerCase());

      return isPremium && matchesSearch;
    });
  }, [products, search]);

  const downloadCatalog = () => {
    if (premiumProducts.length === 0) {
      setError("There are no premium products to export.");
      return;
    }

    const escapeHtml = (value) =>
      String(value ?? "").replace(
        /[&<>"']/g,
        (char) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[char],
      );

    const rows = premiumProducts
      .map(
        (product) => `
      <tr>
        <td>
          ${
            product.image
              ? `<img src="${escapeHtml(getImageUrl(product.image))}"
                   alt="${escapeHtml(product.name)}"
                   style="width:75px;height:65px;object-fit:contain;">`
              : "No image"
          }
        </td>
        <td>${escapeHtml(product.name)}</td>
        <td>${escapeHtml(product.weight || "—")}</td>
        <td>₹${escapeHtml(product.price)}</td>
        <td>₹${escapeHtml(product.oldPrice ?? product.price)}</td>
        <td>${escapeHtml(product.stock ?? 0)}</td>
      </tr>
    `,
      )
      .join("");

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      setError("Please allow pop-ups to download the catalog.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>RUROO Premium Product Catalog</title>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 24px;
              color: #172033;
            }
            h1 { color: #ea580c; margin-bottom: 6px; }
            p { color: #64748b; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 24px;
            }
            th, td {
              border: 1px solid #dbe2ea;
              padding: 10px;
              text-align: left;
              font-size: 12px;
            }
            th { background: #0f172a; color: white; }
            img { display: block; }
            tr { page-break-inside: avoid; }
            @media print {
              body { padding: 0; }
              th { print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <h1>RUROO MegaSale</h1>
          <h2>Premium Product Catalog</h2>
          <p>Total products: ${premiumProducts.length}</p>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Weight</th>
                <th>Price</th>
                <th>MRP</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <script>
            window.onload = async () => {
              const images = Array.from(document.images);
              await Promise.all(images.map((img) => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve) => {
                  img.onload = resolve;
                  img.onerror = resolve;
                });
              }));
              window.print();
            };
          <\/script>
        </body>
      </html>
    `);

    printWindow.document.close();
    setError("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-orange-600">
            RUROO MegaSale / Admin
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Premium Products
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Search premium products and download their catalog.
          </p>
        </div>

        <button
          type="button"
          onClick={downloadCatalog}
          disabled={loading || premiumProducts.length === 0}
          className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ↓ Download Premium Catalog (PDF)
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label htmlFor="premium-search" className="sr-only">
          Search premium products
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            ⌕
          </span>
          <input
            id="premium-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search premium products by name..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="font-semibold text-slate-900">Premium Catalog</h3>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">
            {premiumProducts.length} products
          </span>
        </div>

        {loading ? (
          <p className="p-8 text-center text-slate-500">
            Loading premium products...
          </p>
        ) : premiumProducts.length === 0 ? (
          <p className="p-8 text-center text-slate-500">
            No premium products found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-4 py-4">Weight</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Description
                  </th>
                  <th className="px-4 py-4">Price</th>
                  <th className="px-4 py-4">MRP</th>
                  <th className="px-4 py-4">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {premiumProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="h-14 w-14 rounded-lg border border-slate-100 object-contain"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                            No image
                          </div>
                        )}
                        <span className="font-semibold text-slate-800">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {product.weight || "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {product.description || "No description available"}
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      ₹{product.price}
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      ₹{product.oldPrice ?? product.price}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          Number(product.stock) > 0
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {product.stock ?? 0}
                      </span>
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
