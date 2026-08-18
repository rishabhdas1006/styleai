import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/authStore";
import { useGetProductsQuery } from "@/api/products";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/heading";

export default function AdminMyProductsPage() {
    const { isAuthenticated, role } = useAuth();
    const location = useLocation();

    const { data: products = [], isLoading, error } = useGetProductsQuery({ mine: true });

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (role !== "admin") return <Navigate to="/" replace />;

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
                <Link
                    to="/admin"
                    className="hover:text-foreground transition-colors"
                >
                    Admin
                </Link>
                <span>/</span>
                <span className="text-foreground">My Products</span>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <PageHeading
                        title="My Products"
                        subtitle="Products created by the current admin account"
                        className="mb-0"
                    />
                </div>

                <Link to="/admin/products/create">
                    <Button>Create product</Button>
                </Link>
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-sm text-red-500">Failed to load products.</p>
            ) : products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {products.map((p) => (
                        <div key={p.id} className="flex items-center justify-between rounded-md border border-border p-4">
                            <div>
                                <div className="text-sm font-semibold">{p.name}</div>
                                <div className="text-xs text-muted-foreground">{p.brand} — {p.category}</div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link to={`/products/${p.id}`} className="text-sm text-blue-600">View</Link>
                                <Link to={`/admin/products/${p.id}/variants`} className="text-sm text-blue-600">Variants</Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
