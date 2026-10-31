import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api/admin/contacts";

const statusStyles = {
  new: "bg-blue-100 text-blue-700",
  read: "bg-amber-100 text-amber-700",
  resolved: "bg-green-100 text-green-700",
};

function AdminContactMessages() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);
  const [updatingId, setUpdatingId] = useState("");

  const getToken = () =>
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

  const fetchContacts = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Please log in as an admin again.");
      }

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load contact messages.");
      }

      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load contact messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return contacts.filter((contact) => {
      const matchesStatus =
        statusFilter === "all" || contact.status === statusFilter;

      const matchesSearch = [
        contact.name,
        contact.email,
        contact.subject,
        contact.message,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
      );

      return matchesStatus && matchesSearch;
    });
  }, [contacts, search, statusFilter]);

  const updateStatus = async (contact, status) => {
    try {
      setUpdatingId(contact._id);
      setError("");

      const response = await fetch(`${API_URL}/${contact._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update status.");
      }

      setContacts((previous) =>
        previous.map((item) =>
          item._id === contact._id ? data.contact : item,
        ),
      );

      setSelectedContact((previous) =>
        previous?._id === contact._id ? data.contact : previous,
      );
    } catch (err) {
      setError(err.message || "Unable to update status.");
    } finally {
      setUpdatingId("");
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const newCount = contacts.filter((item) => item.status === "new").length;
  const readCount = contacts.filter((item) => item.status === "read").length;
  const resolvedCount = contacts.filter(
    (item) => item.status === "resolved",
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Contact Messages
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage customer enquiries.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchContacts}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        {error && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={fetchContacts}
              className="font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard title="Total Messages" count={contacts.length} />
          <SummaryCard title="New Messages" count={newCount} color="blue" />
          <SummaryCard title="Read Messages" count={readCount} color="amber" />
          <SummaryCard
            title="Resolved Messages"
            count={resolvedCount}
            color="green"
          />
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-3">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, subject..."
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500 sm:col-span-2"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-gray-500"
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500">
              Loading contact messages...
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mb-2 text-3xl">✉️</div>
              <h2 className="font-semibold text-gray-800">
                No contact messages found
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Messages will appear here when customers contact you.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Subject</th>
                    <th className="px-5 py-4">Received</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredContacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">
                          {contact.name}
                        </p>
                        <p className="mt-1 text-gray-500">{contact.email}</p>
                      </td>

                      <td className="max-w-xs px-5 py-4">
                        <p className="truncate font-medium text-gray-800">
                          {contact.subject}
                        </p>
                        <p className="mt-1 truncate text-gray-500">
                          {contact.message}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {formatDate(contact.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            statusStyles[contact.status] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {contact.status || "new"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedContact(contact)}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredContacts.length > 0 && (
            <div className="border-t border-gray-200 px-5 py-3 text-xs text-gray-500">
              Showing {filteredContacts.length} of {contacts.length} messages
            </div>
          )}
        </div>
      </div>

      {selectedContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedContact(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-details-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-7"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="contact-details-title"
                  className="text-xl font-bold text-gray-900"
                >
                  Message Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Received {formatDate(selectedContact.createdAt)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedContact(null)}
                aria-label="Close message details"
                className="rounded-lg px-3 py-1 text-2xl text-gray-500 hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            <div className="space-y-5">
              <DetailField label="Customer Name" value={selectedContact.name} />
              <DetailField label="Email" value={selectedContact.email} />
              <DetailField label="Subject" value={selectedContact.subject} />

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Message
                </p>
                <p className="whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-800">
                  {selectedContact.message}
                </p>
              </div>

              <div>
                <label
                  htmlFor="contact-status"
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500"
                >
                  Update Status
                </label>

                <select
                  id="contact-status"
                  value={selectedContact.status || "new"}
                  disabled={updatingId === selectedContact._id}
                  onChange={(event) =>
                    updateStatus(selectedContact, event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 disabled:opacity-50"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="mt-7 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedContact(null)}
                className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, count, color = "gray" }) {
  const styles = {
    gray: "border-gray-200",
    blue: "border-blue-200",
    amber: "border-amber-200",
    green: "border-green-200",
  };

  return (
    <div
      className={`rounded-xl border ${styles[color]} bg-white p-5 shadow-sm`}
    >
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{count}</p>
    </div>
  );
}

function DetailField({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="break-words text-sm font-medium text-gray-900">
        {value || "—"}
      </p>
    </div>
  );
}

export default AdminContactMessages;
