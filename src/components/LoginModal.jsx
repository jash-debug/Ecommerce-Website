import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAuthError,
  selectAuthError,
  selectAuthStatus,
  selectAuthUser,
} from "../authSlice";
import { useLoginUser, useSignupUser } from "../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  Loader2,
  LogIn,
  UserRound,
  UserRoundPlus,
  X,
} from "lucide-react";

const defaultCredentials = {
  username: "emilys",
  password: "emilyspass",
};

export function LoginModal({ open, onClose, mode = "signin", onModeChange }) {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const loginMutation = useLoginUser();
  const signupMutation = useSignupUser();
  const [username, setUsername] = useState(defaultCredentials.username);
  const [password, setPassword] = useState(defaultCredentials.password);
  const [firstName, setFirstName] = useState("Muhammad");
  const [lastName, setLastName] = useState("Ovi");
  const [age, setAge] = useState("250");
  const [email, setEmail] = useState("muhammad.ovi@example.com");
  const [phone, setPhone] = useState("+1 555-0100");
  const [gender, setGender] = useState("male");
  const [image, setImage] = useState("https://dummyjson.com/icon/emilys/128");

  useEffect(() => {
    if (!open) {
      dispatch(clearAuthError());
    }
  }, [dispatch, open]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (mode === "signup") {
        await signupMutation.mutateAsync({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          age,
          gender,
          email: email.trim(),
          username: username.trim(),
          password,
          phone: phone.trim(),
          image: image.trim(),
        });
      } else {
        await loginMutation.mutateAsync({
          username: username.trim(),
          password,
          intent: mode,
        });
      }

      onClose();
    } catch {
      // Errors are mapped into Redux via mutation onError handlers.
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm overflow-y-scroll"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md"
        onClick={(event) => event.stopPropagation()}
      >
        <Card className="border-border/70 shadow-2xl">
          <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                {mode === "signup" ? "Create account" : "Secure checkout"}
              </p>
              <CardTitle className="mt-2 text-2xl">
                {mode === "signup" ? "Sign up required" : "Login required"}
              </CardTitle>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition hover:bg-muted"
              aria-label="Close login modal"
            >
              <X className="h-4 w-4" />
            </button>
          </CardHeader>

          <CardContent className="space-y-5 p-5">
            <div className="flex rounded-full border border-border bg-muted/30 p-1 text-sm">
              <button
                type="button"
                onClick={() => onModeChange?.("signin")}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 font-medium transition ${
                  mode === "signin"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <UserRound className="h-4 w-4" />
                Sign in
              </button>
              <button
                type="button"
                onClick={() => onModeChange?.("signup")}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 font-medium transition ${
                  mode === "signup"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <UserRoundPlus className="h-4 w-4" />
                Sign up
              </button>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <p>
                {mode === "signup"
                  ? "Create a demo account using DummyJSON users/add. This simulates signup with the recommended endpoint."
                  : "Sign in with the DummyJSON login endpoint before checkout. The demo account is prefilled."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        First name
                      </label>
                      <input
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="First name"
                        autoComplete="given-name"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Last name
                      </label>
                      <input
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Last name"
                        autoComplete="family-name"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Age
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={age}
                        onChange={(event) => setAge(event.target.value)}
                        className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Age"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(event) => setGender(event.target.value)}
                        className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Email"
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Phone
                    </label>
                    <input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Phone"
                      autoComplete="tel"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Profile image URL
                    </label>
                    <input
                      value={image}
                      onChange={(event) => setImage(event.target.value)}
                      className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                  {error}
                </p>
              )}

              {user && (
                <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent-foreground">
                  Logged in as {user.firstName} {user.lastName}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {mode === "signup" ? "Creating account" : "Signing in"}
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    {mode === "signup" ? "Sign up" : "Sign in"}
                  </>
                )}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
