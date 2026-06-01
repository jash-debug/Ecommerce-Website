import {
  ArrowLeft,
  Check,
  ChevronDown,
  LayoutDashboard,
  PencilLine,
  Trash2,
  X,
  Eye,
  ShoppingBag,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, updateProduct } from "../api/products";
import { useGetAllProducts } from "../hooks/useProducts";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

export function AdminDashboard({ onNavigateHome }) {
  const { data, isLoading, isError, error } = useGetAllProducts();
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => updateProduct(id, updates),
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(["products"], (oldData) =>
        oldData
          ? oldData.map((product) =>
              product.id === updatedProduct.id ? updatedProduct : product,
            )
          : [updatedProduct],
      );
      setModalMode(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(["products"], (oldData) =>
        oldData ? oldData.filter((product) => product.id !== deletedId) : [],
      );
      setModalMode(null);
    },
  });

  const products = data ?? [];

  const modalTitle = useMemo(() => {
    if (!selectedProduct) {
      return "";
    }

    if (modalMode === "edit") {
      return "Edit product";
    }

    if (modalMode === "delete") {
      return "Delete product";
    }

    return "Product details";
  }, [modalMode, selectedProduct]);

  const openModal = (product, mode) => {
    setSelectedProduct(product);
    setModalMode(mode);

    if (mode === "edit") {
      setEditForm({
        title: product.title ?? "",
        price: String(product.price ?? ""),
        category: product.category ?? "",
        description: product.description ?? "",
        image: product.image ?? "",
      });
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedProduct(null);
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (!selectedProduct) {
      return;
    }

    updateMutation.mutate({
      id: selectedProduct.id,
      updates: {
        ...editForm,
        price: Number(editForm.price),
      },
    });
  };

  const handleDelete = () => {
    if (!selectedProduct) {
      return;
    }

    deleteMutation.mutate(selectedProduct.id);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-4 text-foreground md:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
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
                  className="flex w-full items-center justify-between rounded-2xl bg-muted/70 px-4 py-3 font-medium"
                >
                  <span>Products</span>
                  <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
                    {products.length}
                  </span>
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
                >
                  <span>Orders</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
                >
                  <span>Customers</span>
                  <ChevronDown className="h-4 w-4" />
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

        <main className="space-y-4">
          <section className="rounded-[28px] border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  Template route
                </p>
                <h2 className="text-3xl font-semibold tracking-tight">
                  Default dashboard
                </h2>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  The right side stays focused on the product table, showing the
                  complete catalog pulled from the existing products query.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border/60 bg-background px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Products
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {products.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    View
                  </p>
                  <p className="mt-1 text-2xl font-semibold">Table</p>
                </div>
                <div className="col-span-2 rounded-2xl border border-border/60 bg-background px-4 py-3 sm:col-span-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Catalog
                  </p>
                  <p className="mt-1 text-2xl font-semibold">Live</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">All products</h3>
                <p className="text-sm text-muted-foreground">
                  Complete list from the Fake Store API.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground">
                <ShoppingBag className="h-4 w-4" />
                {products.length} items
              </div>
            </div>

            {isLoading ? (
              <div className="flex min-h-80 items-center justify-center rounded-3xl border border-dashed border-border/70 bg-background/60">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
              </div>
            ) : isError ? (
              <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
                {error?.message || "Failed to load products"}
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-border/70 bg-background">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border/70 text-left text-sm">
                    <thead className="bg-muted/40 text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-medium">Product</th>
                        <th className="px-4 py-3 font-medium">Category</th>
                        <th className="px-4 py-3 font-medium">Price</th>
                        <th className="px-4 py-3 font-medium">Description</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/70">
                      {products.map((product) => (
                        <tr
                          key={product.id}
                          className="align-top transition hover:bg-muted/30"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-muted/40">
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt={product.title}
                                    className="h-full w-full object-contain p-1"
                                  />
                                ) : (
                                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                                    {product.title?.slice(0, 2)}
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="max-w-[18rem] font-medium leading-5">
                                  {product.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  ID #{product.id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">
                            {product.category}
                          </td>
                          <td className="px-4 py-4 font-medium">
                            {formatPrice(product.price)}
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">
                            <p className="max-w-xl line-clamp-2">
                              {product.description}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => openModal(product, "view")}
                                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium transition hover:bg-muted"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                View
                              </button>
                              <button
                                type="button"
                                onClick={() => openModal(product, "edit")}
                                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium transition hover:bg-muted"
                              >
                                <PencilLine className="h-3.5 w-3.5" />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => openModal(product, "delete")}
                                className="inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/15"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {modalMode && selectedProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border/70 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Products
                </p>
                <h3 className="text-xl font-semibold">{modalTitle}</h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition hover:bg-muted"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-72px)] overflow-y-auto p-5">
              {modalMode === "view" ? (
                <div className="grid gap-5 md:grid-cols-[180px_minmax(0,1fr)]">
                  <div className="flex items-center justify-center rounded-3xl border border-border/70 bg-muted/30 p-4">
                    {selectedProduct.image ? (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.title}
                        className="max-h-56 w-full object-contain"
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No image
                      </span>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Title</p>
                      <p className="text-lg font-semibold">
                        {selectedProduct.title}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl border border-border/70 bg-background p-3">
                        <p className="text-muted-foreground">Category</p>
                        <p className="mt-1 font-medium">
                          {selectedProduct.category}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border/70 bg-background p-3">
                        <p className="text-muted-foreground">Price</p>
                        <p className="mt-1 font-medium">
                          {formatPrice(selectedProduct.price)}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background p-4 text-sm text-muted-foreground">
                      {selectedProduct.description}
                    </div>
                  </div>
                </div>
              ) : modalMode === "edit" ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2 text-sm">
                      <span className="font-medium">Title</span>
                      <input
                        value={editForm.title}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                        className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:ring-2 focus:ring-ring"
                        required
                      />
                    </label>
                    <label className="space-y-2 text-sm">
                      <span className="font-medium">Price</span>
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.price}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            price: event.target.value,
                          }))
                        }
                        className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:ring-2 focus:ring-ring"
                        required
                      />
                    </label>
                    <label className="space-y-2 text-sm">
                      <span className="font-medium">Category</span>
                      <input
                        value={editForm.category}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            category: event.target.value,
                          }))
                        }
                        className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:ring-2 focus:ring-ring"
                        required
                      />
                    </label>
                    <label className="space-y-2 text-sm">
                      <span className="font-medium">Image URL</span>
                      <input
                        value={editForm.image}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            image: event.target.value,
                          }))
                        }
                        className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:ring-2 focus:ring-ring"
                      />
                    </label>
                  </div>
                  <label className="block space-y-2 text-sm">
                    <span className="font-medium">Description</span>
                    <textarea
                      rows="5"
                      value={editForm.description}
                      onChange={(event) =>
                        setEditForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:ring-2 focus:ring-ring"
                      required
                    />
                  </label>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <Check className="h-4 w-4" />
                      {updateMutation.isPending ? "Saving..." : "Save changes"}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                    This will permanently remove{" "}
                    <span className="font-semibold">
                      {selectedProduct.title}
                    </span>{" "}
                    from the product list.
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deleteMutation.isPending
                        ? "Deleting..."
                        : "Delete product"}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
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
      ) : null}
    </div>
  );
}
