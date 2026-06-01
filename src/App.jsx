import { useEffect, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ProductsList } from "./components/ProductsList";
import { CartSheet } from "./components/CartSheet";
import { LoginModal } from "./components/LoginModal";
import { AdminDashboard } from "./pages/AdminDashboard";

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (to) => {
    window.history.pushState({}, "", to);
    setPathname(to);
  };

  const openAuth = (mode) => {
    if (mode === "guest") {
      return;
    }

    setAuthMode(mode);
    setIsLoginOpen(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {pathname.startsWith("/dashboard") ? (
        <AdminDashboard onNavigateHome={() => navigate("/")} />
      ) : (
        <>
          <ProductsList
            onOpenCart={() => setIsCartOpen(true)}
            onOpenAuth={openAuth}
          />
          <CartSheet
            open={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onCheckoutRequiresLogin={() => setIsLoginOpen(true)}
          />
          <LoginModal
            open={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            mode={authMode}
            onModeChange={setAuthMode}
          />
        </>
      )}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
