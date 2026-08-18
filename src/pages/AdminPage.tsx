import { Link, Navigate, useLocation } from "react-router-dom";
import { Package, Tags } from "lucide-react";
import { useAuth } from "@/lib/authStore";

const adminLinks = [
    {
        title: "Create Category",
        description: "Add a new product category",
        href: "/admin/categories/create",
        icon: Tags,
    },
    {
        title: "My Categories",
        description: "View categories you've created",
        href: "/admin/categories/my",
        icon: Tags,
    },
    {
        title: "Create Product",
        description: "Add a new product to the store",
        href: "/admin/products/create",
        icon: Package,
    },
    {
        title: "My Products",
        description: "View products created by the current admin",
        href: "/admin/products/my",
        icon: Package,
    },

];

export default function AdminPage() {
    const { isAuthenticated, role } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (role !== "admin") return <Navigate to="/" replace />;

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
                <span className="text-foreground">Admin</span>
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight text-black mb-2">
                ADMIN DASHBOARD
            </h1>

            <p className="text-black/60 mb-8">
                Manage your store's products and categories.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
                {adminLinks.map((link) => (
                    <Link
                        key={link.href}
                        to={link.href}
                        className="group flex items-start gap-4 rounded-lg border border-foreground/10 p-5 transition-colors hover:border-foreground/30"
                    >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
                            <link.icon className="size-5" strokeWidth={1.5} />
                        </div>

                        <div>
                            <h3 className="font-display text-base font-semibold text-black group-hover:underline">
                                {link.title}
                            </h3>

                            <p className="text-sm text-black/55 mt-0.5">
                                {link.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
