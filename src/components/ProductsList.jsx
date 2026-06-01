import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, selectCartCount } from "../cartSlice";
import { logout, selectAuthUser, selectIsAuthenticated } from "../authSlice";
import {
  useGetAllProducts,
  useDeleteProduct,
  useUpdateProduct,
  useCreateProduct,
} from "../hooks/useProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Plus, ShoppingCart, UserRound } from "lucide-react";

const Input = ({ label, ...props }) => (
  <div className="mb-3">
    {label && (
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
    )}
    <input
      {...props}
      className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
    />
  </div>
);

const initialForm = {
  title: "",
  description: "",
  price: "",
  category: "",
  image: "",
};

export function ProductsList({ onOpenCart, onOpenAuth }) {
  const { data, isLoading, isError, error } = useGetAllProducts();
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();
  const createProduct = useCreateProduct();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const authUser = useSelector(selectAuthUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = (
    authUser?.role || (isAuthenticated ? "user" : "guest")
  ).toLowerCase();
  const canEdit = userRole === "admin" || userRole === "moderator";
  const canDelete = userRole === "admin";
  const canCreate = userRole === "admin";
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!canCreate && !editingId) {
      return;
    }

    if (!canEdit && editingId) {
      return;
    }

    const data = { ...formData, price: parseFloat(formData.price) };

    const mutationFn = editingId
      ? () => updateProduct.mutate({ id: editingId, ...data })
      : () => createProduct.mutate(data);
    mutationFn();
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleEdit = (product) => {
    if (!canEdit) {
      return;
    }

    setEditingId(product.id);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image || "",
    });
    setShowForm(true);
  };

  const handleDelete = (productId) => {
    if (!canDelete) {
      return;
    }

    deleteProduct.mutate(productId);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
      </div>
    );
  if (isError)
    return (
      <div className="py-16 text-center text-primary">
        <p>Error: {error.message}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-2xl border border-border/80 bg-card/95 p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Shopping dashboard
              </p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight">
                Product management
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Browse products, add items to cart, and sign in or sign up with
                the same DummyJSON auth endpoint. Guest browsing stays available
                too.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isAuthenticated ? (
                <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <span className="font-medium">
                    {authUser?.firstName} {authUser?.lastName}
                  </span>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground">
                    {userRole}
                  </span>
                  <button
                    type="button"
                    onClick={() => dispatch(logout())}
                    className="text-muted-foreground transition hover:text-foreground"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenAuth("guest")}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-dashed border-border bg-background px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted"
                >
                  <ArrowRight className="h-4 w-4" />
                  Continue as guest
                </button>
              )}

              <button
                type="button"
                onClick={onOpenCart}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium transition hover:bg-muted"
              >
                <ShoppingCart className="h-4 w-4" />
                Cart
                <span className="inline-flex min-w-6 items-center justify-center rounded-md bg-primary px-1.5 py-0.5 text-xs font-semibold text-primary-foreground">
                  {cartCount}
                </span>
              </button>

              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={() => onOpenAuth("signin")}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium transition hover:bg-muted"
                >
                  <UserRound className="h-4 w-4" />
                  Sign in
                </button>
              )}

              {canCreate && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  <Plus className="h-4 w-4" />
                  Add product
                </button>
              )}
            </div>
          </div>
        </div>

        {showForm && (
          <Card className="mb-8 border-border/70 shadow-sm">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle>{editingId ? "Edit" : "Add"} Product</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-1">
                <Input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
                <Input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                />
                <div className="mb-3">
                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    rows="3"
                    className="min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                  ></textarea>
                </div>
                <Input
                  type="number"
                  placeholder="Price"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
                <Input
                  type="url"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-secondary text-white hover:opacity-90"
                  >
                    {editingId ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex h-10 flex-1 items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data?.map((product) => (
            <Card
              key={product.id}
              className="border-border/70 shadow-sm transition-shadow hover:shadow-md"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-44 w-full object-contain border-b border-border/50 bg-muted/20 p-4"
                />
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">{product.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="rounded bg-accent px-2 py-1 text-xs text-accent-foreground">
                    {product.category}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <button
                    onClick={() => dispatch(addItem(product))}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground transition hover:opacity-90 sm:col-span-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add to cart
                  </button>
                  {canEdit && (
                    <button
                      onClick={() => handleEdit(product)}
                      className="inline-flex h-10 items-center justify-center rounded-md border border-border px-3 text-sm font-medium transition hover:bg-muted"
                    >
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="inline-flex h-10 items-center justify-center rounded-md border border-primary/30 bg-primary/10 px-3 text-sm font-medium text-primary transition hover:bg-primary/15"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
