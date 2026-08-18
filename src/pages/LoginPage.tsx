import { useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/api/auth";
import { useAddCartItemMutation } from "@/api/cart";
import { getApiErrorMessage } from "@/lib/apiError";
import { useAuth } from "@/lib/authStore";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const loginMutation = useLoginMutation();
    const addCartItemMutation = useAddCartItemMutation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const pendingCartItem = (
        location.state as {
            pendingCartItem?: { variantId: string; quantity: number };
            from?: { pathname?: string };
        }
    )?.pendingCartItem;

    const fromPath =
        (
            location.state as {
                from?: { pathname?: string };
            }
        )?.from?.pathname || "/";

    if (isAuthenticated) return <Navigate to={fromPath} replace />;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await loginMutation.mutateAsync({ email, password });

            if (pendingCartItem) {
                await addCartItemMutation.mutateAsync(pendingCartItem);
                navigate("/cart", { replace: true });
            } else {
                navigate(fromPath, { replace: true });
            }
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, "Invalid email or password"));
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f0] flex flex-col">
            {/* Header with logo */}
            <div className="px-6 md:px-10 py-4 md:py-5">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2"
                    aria-label="Home"
                >
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M12 8L28 20L12 32V8Z"
                            fill="currentColor"
                        />
                    </svg>
                </Link>
            </div>

            {/* Main content */}
            <div className="flex-1 flex items-start md:items-center justify-center px-6 pt-8 md:pt-0 pb-16">
                <div className="w-full max-w-sm">
                    {/* Title */}
                    <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                        SIGN IN
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Welcome back. Sign in to access your account.
                    </p>

                    {/* Error message */}
                    {error && (
                        <div className="mt-5 rounded-sm bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full h-11 rounded-sm border border-foreground/15 bg-white px-4 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-foreground/40"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full h-11 rounded-sm border border-foreground/15 bg-white px-4 pr-11 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-foreground/40"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label={
                                        showPassword ? "Hide password" : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" strokeWidth={1.5} />
                                    ) : (
                                        <Eye className="size-4" strokeWidth={1.5} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className={cn(
                                "w-full h-12 rounded-sm text-sm font-bold uppercase tracking-wider transition-colors",
                                loginMutation.isPending
                                    ? "bg-foreground/10 text-foreground/40 cursor-not-allowed"
                                    : "bg-foreground text-background hover:bg-foreground/90"
                            )}
                        >
                            {loginMutation.isPending ? "SIGNING IN..." : "SIGN IN"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mt-8">
                        <div className="flex-1 h-px bg-foreground/10" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                            or
                        </span>
                        <div className="flex-1 h-px bg-foreground/10" />
                    </div>

                    {/* Register link */}
                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-foreground hover:opacity-70 transition-opacity"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
