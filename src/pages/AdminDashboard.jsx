import {
  ArrowLeft,
  ChevronDown,
  LayoutDashboard
} from "lucide-react";
import { useGetAllProducts } from "../hooks/useProducts";
import Products from "../components/dashboard/Products";
import Orders from "../components/dashboard/Orders";
import Customers from "../components/dashboard/Customers";
import { Routes, Route, Link, NavLink } from "react-router";



export function AdminDashboard() {
  const { data } = useGetAllProducts();
  const products = data ?? [];

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

                <NavLink to='/dashboard' end
                  type="button"
                  className={({ isActive }) =>
                  `flex w-full items-center justify-between rounded-2xl px-4 py-3 transition ${
                    isActive
                      ? "bg-muted/70 font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`
                }>
                  Products
                  <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
                    {products.length}
                  </span>
                </NavLink>

               <NavLink to='/dashboard/orders'
                  type="button"
                  className={({ isActive }) =>
                  `flex w-full items-center justify-between rounded-2xl px-4 py-3 transition ${
                    isActive
                      ? "bg-muted/70 font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`
                } > 
                  Orders
                  <ChevronDown className="h-4 w-4" />
               </NavLink>

                <NavLink to='/dashboard/customers'
                  type="button"
                  className={({ isActive }) =>
                  `flex w-full items-center justify-between rounded-2xl px-4 py-3 transition ${
                    isActive
                      ? "bg-muted/70 font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`
                } >
                  Customers
                  <ChevronDown className="h-4 w-4" />
                </NavLink>
              </nav>
            </div>

            <Link
            to='/'
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium transition hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to shop
            </Link>
          </div>
        </aside>

    <Routes>
      <Route index element={ < Products /> } />
      <Route path="/orders" element={ < Orders /> } />
      <Route path="/customers" element={ < Customers /> } />
    </Routes>
     
      </div>

     
    </div>
  );
}
