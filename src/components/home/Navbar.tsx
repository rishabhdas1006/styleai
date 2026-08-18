import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { clearAuthSession, useAuth } from "@/lib/authStore";

const menus = {
    WOMAN: ["New in", "Dresses", "Tops", "Shoes", "Bags"],
    MAN: ["New in", "Shirts", "Trousers", "Shoes", "Accessories"],
    EDITORIAL: ["Summer edit", "Minimal layers", "Tailoring", "Essentials"],
};

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menu, setMenu] = useState<keyof typeof menus | null>(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const { isAuthenticated, role } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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

    const solid = scrolled || menu || userMenuOpen;

    return (
        <>
            {menu && (
                <div
                    className="fixed inset-0 z-30 bg-black/20"
                    onClick={() => setMenu(null)}
                />
            )}

            <header
                className={`fixed left-0 top-0 z-50 w-full transition-colors duration-300 ${
                    solid ? "bg-white text-black" : "bg-transparent text-white"
                }`}
            >
                <div className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-4 md:h-24 md:px-8">
                    <button
                        type="button"
                        onClick={() => setMenu(menu ? null : "WOMAN")}
                        className="flex size-10 items-center justify-center md:hidden"
                        aria-label={menu ? "Close menu" : "Open menu"}
                    >
                        {menu ? (
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
                        {Object.keys(menus).map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() =>
                                    setMenu(menu === item ? null : item as keyof typeof menus)
                                }
                                className="transition-opacity hover:opacity-60"
                            >
                                {item}
                            </button>
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
                            className="flex size-10 items-center justify-center"
                            aria-label="Cart"
                        >
                            <ShoppingBag size={18} strokeWidth={1.3} />
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
                                    <div className="absolute right-0 mt-3 w-44 border border-black/10 bg-white py-1 text-left text-black shadow-sm">
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

                {menu && (
                    <div className="border-t border-black/10 bg-white text-black">
                        <div className="mx-auto max-w-screen-2xl px-6 py-8 md:px-8 md:py-12">
                            <div className="grid gap-5 text-sm uppercase md:grid-cols-4 md:text-lg">
                                {menus[menu].map((item) => (
                                    <Link
                                        key={item}
                                        to="/products"
                                        onClick={() => setMenu(null)}
                                        className="text-left underline-offset-4 hover:underline"
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}
