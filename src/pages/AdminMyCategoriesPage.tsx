import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/authStore";
import { useGetMyCategoriesQuery } from "@/api/products";
import { Button } from "@/components/ui/button";

export default function AdminMyCategoriesPage() {
    const { isAuthenticated, role } = useAuth();
    const location = useLocation();

    const { data: categories = [], isLoading, error } = useGetMyCategoriesQuery();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (role !== "admin") return <Navigate to="/" replace />;

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
                <Link
                    to="/admin"
                    className="hover:text-foreground transition-colors"
                >
                    Admin
                </Link>
                <span>/</span>
                <span className="text-foreground">My Categories</span>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight text-black mb-2">My Categories</h1>
                    <p className="text-sm text-black/60">Categories you have created</p>
                </div>

                <Link to="/admin/categories/create">
                    <Button>Create category</Button>
                </Link>
            </div>

            {isLoading ? (
                <p className="text-black/60">Loading...</p>
            ) : error ? (
                <p className="text-sm text-red-500">Failed to load categories.</p>
            ) : categories.length === 0 ? (
                <p className="text-black/60">No categories found.</p>
            ) : (
                <ul className="space-y-3">
                    {categories.map((c) => (
                        <li key={c.id} className="flex items-center justify-between rounded-md border border-border p-3">
                            <div className="text-sm font-medium">{c.name}</div>
                            <div className="text-xs text-muted-foreground">ID: {c.id}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
