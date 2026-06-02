import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  PencilLine,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  Users,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useGetUsers, useCreateUser, useUpdateUser, useDeleteUser } from "../hooks/useUsers";
import { PAGE_LIMIT } from "../api/users";
import { UserModal } from "../components/UserModal";

const roleBadge = (role) => {
  const styles = {
    admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    moderator: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    user: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[role] ?? styles.user}`}
    >
      {role}
    </span>
  );
};

export function UserDashboard({ onNavigateHome, onNavigateProducts }) {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(null);

  // Debounce search input 400 ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError, error } = useGetUsers({
    page,
    search: debouncedSearch,
  });

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_LIMIT);

  const openModal = (user, mode) => {
    setSelectedUser(user);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalMode(null);
  };

  const isPending =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleSave = (formData) => {
    if (!selectedUser) return;
    updateMutation.mutate(
      { id: selectedUser.id, updates: formData },
      { onSuccess: closeModal },
    );
  };

  const handleAdd = (formData) => {
    createMutation.mutate(formData, { onSuccess: closeModal });
  };

  const handleDelete = () => {
    if (!selectedUser) return;
    deleteMutation.mutate(selectedUser.id, { onSuccess: closeModal });
  };

  return (
    <div className="min-h-screen bg-background px-4 py-4 text-foreground md:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* â”€â”€ Sidebar â”€â”€ */}
        <aside className="rounded-[28px] border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur">
          <div className="flex h-full flex-col justify-between gap-8">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Admin panel
                  </p>
                  <h1 className="text-lg font-semibold">Dashboard</h1>
                </div>
              </div>

              <nav className="space-y-2 text-sm">
                <button
                  type="button"
                  onClick={onNavigateProducts}
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
                >
                  <span>Products</span>
                  <ShoppingBag className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl bg-muted/70 px-4 py-3 font-medium"
                >
                  <span>USERS</span>
                  <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
                    {total}
                  </span>
                </button>
              </nav>
            </div>

            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium transition hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to shop
            </button>
          </div>
        </aside>

        {/* â”€â”€ Main â”€â”€ */}
        <main className="space-y-4">
          {/* Stats header */}
          <section className="rounded-[28px] border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  User management
                </p>
                <h2 className="text-3xl font-semibold tracking-tight">USERS</h2>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  Manage all registered users admins, moderators and regular customers
                  — from the DummyJSON API.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border/60 bg-background px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Total
                  </p>
                  <p className="mt-1 text-2xl font-semibold">{total}</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Pages
                  </p>
                  <p className="mt-1 text-2xl font-semibold">{totalPages}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Table section */}
          <section className="rounded-[28px] border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur">
            {/* Toolbar */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold">All users</h3>
                <p className="text-sm text-muted-foreground">
                  {debouncedSearch
                    ? `${total} result${total !== 1 ? "s" : ""} for "${debouncedSearch}"`
                    : `Page ${page} of ${totalPages || 1}`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search bar */}
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search users..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="h-9 w-52 rounded-full border border-border bg-background pl-9 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Add user button */}
                <button
                  type="button"
                  onClick={() => openModal(null, "add")}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  <Plus className="h-4 w-4" />
                  Add user
                </button>

                {/* Users count badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {users.length} shown
                </div>
              </div>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="flex min-h-80 items-center justify-center rounded-3xl border border-dashed border-border/70 bg-background/60">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
              </div>
            ) : isError ? (
              <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
                {error?.message || "Failed to load users"}
              </div>
            ) : (
              <>
                <div className="overflow-hidden rounded-3xl border border-border/70 bg-background">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border/70 text-left text-sm">
                      <thead className="bg-muted/40 text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 font-medium">User</th>
                          <th className="px-4 py-3 font-medium">Username</th>
                          <th className="px-4 py-3 font-medium">Email</th>
                          <th className="px-4 py-3 font-medium">Role</th>
                          <th className="px-4 py-3 font-medium">Age</th>
                          <th className="px-4 py-3 font-medium">Phone</th>
                          <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/70">
                        {users.length === 0 ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-4 py-12 text-center text-sm text-muted-foreground"
                            >
                              No users found.
                            </td>
                          </tr>
                        ) : (
                          users.map((user) => (
                            <tr
                              key={user.id}
                              className="align-top transition hover:bg-muted/30"
                            >
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/70 bg-muted/40">
                                    {user.image ? (
                                      <img
                                        src={user.image}
                                        alt={`${user.firstName} ${user.lastName}`}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <span className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase text-muted-foreground">
                                        {user.firstName?.[0]}
                                        {user.lastName?.[0]}
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      ID #{user.id}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-muted-foreground">
                                @{user.username}
                              </td>
                              <td className="px-4 py-4 text-muted-foreground">
                                {user.email}
                              </td>
                              <td className="px-4 py-4">{roleBadge(user.role)}</td>
                              <td className="px-4 py-4 text-muted-foreground">
                                {user.age}
                              </td>
                              <td className="px-4 py-4 text-muted-foreground">
                                {user.phone}
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => openModal(user, "view")}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium transition hover:bg-muted"
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                    View
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => openModal(user, "edit")}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium transition hover:bg-muted"
                                  >
                                    <PencilLine className="h-3.5 w-3.5" />
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => openModal(user, "delete")}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/15"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {(page - 1) * PAGE_LIMIT + 1}â€“
                      {Math.min(page * PAGE_LIMIT, total)} of {total}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      {/* Page numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (p) =>
                            p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                        )
                        .reduce((acc, p, idx, arr) => {
                          if (idx > 0 && p - arr[idx - 1] > 1) {
                            acc.push("...");
                          }
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((item, idx) =>
                          item === "..." ? (
                            <span
                              key={`ellipsis-${idx}`}
                              className="px-1 text-sm text-muted-foreground"
                            >
                              to
                            </span>
                          ) : (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setPage(item)}
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition ${
                                item === page
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-background hover:bg-muted"
                              }`}
                            >
                              {item}
                            </button>
                          ),
                        )}

                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      </div>

      {/* Modal */}
      {modalMode && (
        <UserModal
          mode={modalMode}
          user={selectedUser}
          onClose={closeModal}
          onSave={handleSave}
          onAdd={handleAdd}
          onDelete={handleDelete}
          isPending={isPending}
        />
      )}
    </div>
  );
}
