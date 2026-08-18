import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useGetCartQuery } from "@/api/cart";
import { clearAuthSession, useAuth } from "@/lib/authStore";

const navLinks = [
    { label: "Woman", href: "/products" },
    { label: "Man", href: "/products" },
    { label: "Editorial", href: "/products" },
];

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const { isAuthenticated, role } = useAuth();
    const navigate = useNavigate();

    const { data: cart } = useGetCartQuery(isAuthenticated);

    const cartCount = isAuthenticated
        ? (cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0)
        : 0;

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(e.target as Node)
            ) {
                setUserMenuOpen(false);
            }
        }

        if (userMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [userMenuOpen]);

    const handleLogout = () => {
        clearAuthSession();
        setUserMenuOpen(false);
        navigate("/");
    };

    return (
        <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 text-black backdrop-blur">
            <div className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-4 md:h-24 md:px-8">
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex size-10 items-center justify-center md:hidden"
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                    {mobileMenuOpen ? (
                        <X size={21} strokeWidth={1.3} />
                    ) : (
                        <Menu size={22} strokeWidth={1.3} />
                    )}
                </button>

                <Link
                    to="/"
                    className="text-2xl font-semibold leading-none md:text-4xl"
                    aria-label="StyleAI home"
                >
                    STYLEAI
                </Link>

                <nav className="hidden items-center gap-8 text-[11px] uppercase md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            to={link.href}
                            className="transition-opacity hover:opacity-60"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-1 md:gap-3">
                    <Link
                        to="/products"
                        className="hidden h-10 items-center px-2 text-[11px] uppercase md:flex"
                    >
                        Search
                    </Link>
                    <Link
                        to="/products"
                        className="flex size-10 items-center justify-center md:hidden"
                        aria-label="Search"
                    >
                        <Search size={18} strokeWidth={1.3} />
                    </Link>
                    <Link
                        to="/cart"
                        className="relative flex size-10 items-center justify-center"
                        aria-label="Cart"
                    >
                        <ShoppingBag size={18} strokeWidth={1.3} />
                        {cartCount > 0 && (
                            <span className="absolute right-1 top-1 flex size-4 items-center justify-center bg-black text-[9px] text-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <div className="relative" ref={userMenuRef}>
                            <button
                                type="button"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex size-10 items-center justify-center"
                                aria-label="Account menu"
                            >
                                <User size={18} strokeWidth={1.3} />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 mt-3 w-44 border border-black/10 bg-white py-1 text-left shadow-sm">
                                    {role === "admin" && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="block px-4 py-2 text-xs uppercase text-black/70 hover:text-black"
                                        >
                                            Admin
                                        </Link>
                                    )}

                                    <Link
                                        to="/profile"
                                        onClick={() => setUserMenuOpen(false)}
                                        className="block px-4 py-2 text-xs uppercase text-black/70 hover:text-black"
                                    >
                                        Profile
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="block w-full px-4 py-2 text-left text-xs uppercase text-black/70 hover:text-black"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="flex size-10 items-center justify-center"
                            aria-label="Sign in"
                        >
                            <User size={18} strokeWidth={1.3} />
                        </Link>
                    )}
                </div>
            </div>

            {mobileMenuOpen && (
                <nav className="border-t border-black/10 bg-white px-4 py-6 md:hidden">
                    <div className="grid gap-5 text-sm uppercase">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            to={isAuthenticated ? "/profile" : "/login"}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Account
                        </Link>
                        {isAuthenticated && role === "admin" && (
                            <Link
                                to="/admin"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Admin
                            </Link>
                        )}
                    </div>
                </nav>
            )}
        </header>
    );
}
