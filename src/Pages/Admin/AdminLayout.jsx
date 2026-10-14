import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navigation = [
  { label: "Dashboard", path: "/admin", icon: "▦", end: true },
  { label: "Products", path: "/admin/products", icon: "□" },
  { label: "Categories", path: "/admin/categories", icon: "▤" },
  { label: "Premium", path: "/admin/premium", icon: "✦" },
  { label: "New Launch", path: "/admin/new-launch", icon: "✧" },
  { label: "Orders", path: "/admin/orders", icon: "▣" },
  { label: "Customers", path: "/admin/customers", icon: "♙" },
  { label: "Inventory", path: "/admin/inventory", icon: "▥" },
  { label: "Contact Messages", path: "/admin/contacts", icon: "✉" },
  { label: "Reports & Analytics", path: "/admin/reports", icon: "▧" },
  { label: "Settings", path: "/admin/settings", icon: "⚙" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 text-slate-300 transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-12 w-44 items-center justify-start overflow-hidden">
            <img
              src="/RUROO_Logo.png"
              alt="RUROO MegaSale Logo"
              className="h-full w-full object-contain object-left"
            />
          </div>

          
        </div>

        <div className="px-5 pb-2 pt-6 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Workspace
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-5">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-950/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span
                className="flex w-5 justify-center text-lg"
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <span aria-hidden="true">↗</span>
            Visit Store
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <span aria-hidden="true">⇥</span>
            Logout
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7 lg:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className="rounded-lg border border-slate-200 px-3 py-2 text-lg hover:bg-slate-50 lg:hidden"
            >
              ☰
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm text-slate-500">
                RUROO MegaSale / Admin
              </p>
              <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                Store Management
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {user?.name || "Administrator"}
              </p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-700">
              {(user?.name || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-7 lg:p-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
