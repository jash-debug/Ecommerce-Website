import { Check, Trash2, X } from "lucide-react";
import { useState } from "react";

const ROLES = ["admin", "moderator", "user"];

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

const InfoField = ({ label, value }) => (
  <div className="rounded-2xl border border-border/70 bg-background p-3 text-sm">
    <p className="text-muted-foreground">{label}</p>
    <p className="mt-1 font-medium">{value || "—"}</p>
  </div>
);

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  phone: "",
  age: "",
  role: "user",
};

function buildForm(user) {
  if (!user) return EMPTY_FORM;
  return {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email ?? "",
    username: user.username ?? "",
    phone: user.phone ?? "",
    age: String(user.age ?? ""),
    role: user.role ?? "user",
  };
}

const MODAL_TITLES = {
  view: "User details",
  edit: "Edit user",
  add: "Add user",
  delete: "Delete user",
};

/**
 * @param {{ mode: "view"|"edit"|"add"|"delete", user: object|null,
 *           onClose: () => void, onSave: (data: object) => void,
 *           onAdd: (data: object) => void, onDelete: () => void,
 *           isPending: boolean }} props
 */
export function UserModal({ mode, user, onClose, onSave, onAdd, onDelete, isPending }) {
  const [form, setForm] = useState(() => buildForm(user));

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, age: Number(form.age) };
    if (mode === "edit") onSave(payload);
    else onAdd(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border/70 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Users
            </p>
            <h3 className="text-xl font-semibold">{MODAL_TITLES[mode]}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition hover:bg-muted"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[calc(90vh-72px)] overflow-y-auto p-5">
          {/* ── VIEW ── */}
          {mode === "view" && user && (
            <div className="grid gap-5 md:grid-cols-[160px_minmax(0,1fr)]">
              {/* Avatar card */}
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-border/70 bg-muted/30 p-4">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-24 w-24 rounded-full border border-border/70 object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted text-xl font-semibold uppercase">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </div>
                )}
                <div className="text-center">
                  <p className="font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">@{user.username}</p>
                  <div className="mt-2">{roleBadge(user.role)}</div>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3">
                <InfoField label="Email" value={user.email} />
                <InfoField label="Phone" value={user.phone} />
                <InfoField label="Age" value={user.age} />
                <InfoField label="Gender" value={user.gender} />
                <InfoField label="Birth date" value={user.birthDate} />
                <InfoField label="Blood group" value={user.bloodGroup} />
                <InfoField label="City" value={user.address?.city} />
                <InfoField label="Country" value={user.address?.country} />
                <InfoField label="University" value={user.university} />
                <InfoField label="Company" value={user.company?.name} />
                <InfoField label="Department" value={user.company?.department} />
                <InfoField label="Job title" value={user.company?.title} />
              </div>
            </div>
          )}

          {/* ── EDIT / ADD ── */}
          {(mode === "edit" || mode === "add") && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="font-medium">First name</span>
                  <input
                    value={form.firstName}
                    onChange={set("firstName")}
                    className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:ring-2 focus:ring-ring"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-medium">Last name</span>
                  <input
                    value={form.lastName}
                    onChange={set("lastName")}
                    className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:ring-2 focus:ring-ring"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-medium">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:ring-2 focus:ring-ring"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-medium">Username</span>
                  <input
                    value={form.username}
                    onChange={set("username")}
                    className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:ring-2 focus:ring-ring"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-medium">Phone</span>
                  <input
                    value={form.phone}
                    onChange={set("phone")}
                    className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:ring-2 focus:ring-ring"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-medium">Age</span>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={form.age}
                    onChange={set("age")}
                    className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:ring-2 focus:ring-ring"
                  />
                </label>
                <label className="space-y-2 text-sm md:col-span-2">
                  <span className="font-medium">Role</span>
                  <select
                    value={form.role}
                    onChange={set("role")}
                    className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:ring-2 focus:ring-ring"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Check className="h-4 w-4" />
                  {isPending
                    ? mode === "add"
                      ? "Adding..."
                      : "Saving..."
                    : mode === "add"
                      ? "Add user"
                      : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* ── DELETE ── */}
          {mode === "delete" && user && (
            <div className="space-y-5">
              <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                This will permanently remove{" "}
                <span className="font-semibold">
                  {user.firstName} {user.lastName}
                </span>{" "}
                (@{user.username}) from the user list.
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Trash2 className="h-4 w-4" />
                  {isPending ? "Deleting..." : "Delete user"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
