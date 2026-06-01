import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeItem,
  selectCartItems,
  selectCartSubtotal,
} from "../cartSlice";
import { selectAuthUser, selectIsAuthenticated } from "../authSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export function CartSheet({ open, onClose, onCheckoutRequiresLogin }) {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const user = useSelector(selectAuthUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");

  const handleClose = useCallback(() => {
    setPromoCode("");
    setAppliedPromo("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  const discount = useMemo(() => {
    if (appliedPromo.toUpperCase() !== "SAVE10") {
      return 0;
    }

    return subtotal * 0.1;
  }, [appliedPromo, subtotal]);

  const taxes = subtotal * 0.075;
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + taxes + shipping - discount;

  const handleApplyPromo = () => {
    setAppliedPromo(promoCode.trim());
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      onCheckoutRequiresLogin?.();
      return;
    }

    window.alert(`Checkout ready for ${user?.firstName || "signed in user"}.`);
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
      onClick={handleClose}
    >
      <div
        className="ml-auto flex h-full w-full max-w-5xl flex-col overflow-hidden bg-background shadow-2xl lg:w-[92vw]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Shopping cart
            </p>
            <h2 className="mt-1 text-2xl font-semibold">Your cart</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:bg-muted"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid flex-1 overflow-hidden lg:grid-cols-[minmax(0,1.35fr)_360px]">
          <section className="overflow-y-auto px-5 py-6 sm:px-6">
            {items.length ? (
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="border-border/70 shadow-sm">
                    <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted/30">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <CardTitle className="truncate text-lg">
                              {item.title}
                            </CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {item.category}
                            </p>
                          </div>
                          <p className="text-lg font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <div className="inline-flex items-center rounded-full border border-border bg-muted/30 p-1">
                            <button
                              type="button"
                              onClick={() =>
                                dispatch(decreaseQuantity(item.id))
                              }
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-background"
                              aria-label={`Decrease ${item.title}`}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-8 px-2 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                dispatch(increaseQuantity(item.id))
                              }
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-background"
                              aria-label={`Increase ${item.title}`}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => dispatch(removeItem(item.id))}
                            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <button
                  type="button"
                  onClick={() => dispatch(clearCart())}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                >
                  Clear cart
                </button>

                <Card className="border-border/70 shadow-sm">
                  <CardHeader className="space-y-2 border-b border-border/60 pb-4">
                    <CardTitle className="text-lg">Promo code</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Apply SAVE10 for a simple discount.
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4 p-4 sm:p-5">
                    <div className="flex gap-2">
                      <input
                        value={promoCode}
                        onChange={(event) => setPromoCode(event.target.value)}
                        placeholder="Enter code"
                        className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-4 text-sm font-medium text-secondary-foreground transition hover:opacity-90"
                      >
                        Apply
                      </button>
                    </div>

                    {appliedPromo && (
                      <p className="text-sm text-muted-foreground">
                        Applied code:{" "}
                        <span className="font-medium text-foreground">
                          {appliedPromo}
                        </span>
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="border-dashed border-border/80">
                <CardContent className="flex min-h-90 flex-col items-center justify-center gap-4 py-10 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
                    <ShoppingCart className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">Your cart is empty</p>
                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                      Add products from the list to see them appear here with
                      quantity controls and an order summary.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>

          <aside className="border-t border-border/70 bg-muted/20 px-5 py-6 lg:border-l lg:border-t-0 lg:px-6">
            <Card className="h-full border-border/70 shadow-sm">
              <CardHeader className="space-y-2 border-b border-border/60 pb-4">
                <CardTitle className="text-lg">Order summary</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Review the subtotal, taxes, and any promo discount before
                  checkout.
                </p>
              </CardHeader>

              <CardContent className="space-y-6 p-4 sm:p-5">
                <div className="space-y-3 rounded-2xl border border-border/70 bg-background p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Taxes</span>
                    <span className="font-medium">{formatPrice(taxes)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-emerald-600">
                      -{formatPrice(discount)}
                    </span>
                  </div>

                  <div className="border-t border-border/70 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold">Total</span>
                      <span className="text-xl font-semibold">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  {isAuthenticated ? "Checkout" : "Sign in to checkout"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
