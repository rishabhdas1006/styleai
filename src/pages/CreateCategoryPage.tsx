import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeading } from "@/components/ui/heading";
import { useAuth } from "@/lib/authStore";
import { getApiErrorMessage } from "@/lib/apiError";
import {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
} from "@/api/products";

export default function CreateCategoryPage() {
    const { isAuthenticated, role } = useAuth();

    const location = useLocation();
    const { data: categories = [] } = useGetCategoriesQuery();
    const createCategoryMutation = useCreateCategoryMutation();

    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (role !== "admin") return <Navigate to="/" replace />;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!name.trim()) {
            setError("Category name is required.");
            return;
        }

        try {
            const result = await createCategoryMutation.mutateAsync({
                name: name.trim(),
            });

            setSuccess(`Category "${result.name}" created successfully!`);
            setName("");
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, "Failed to create category"));
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
                <Link
                    to="/admin"
                    className="hover:text-foreground transition-colors"
                >
                    Admin
                </Link>
                <span>/</span>
                <span className="text-foreground">
                    Create Category
                </span>
            </div>

            <PageHeading
                title="CREATE CATEGORY"
                subtitle="Create a new product category."
                className="mb-8"
            />

            {/* Existing categories */}
            {categories.length > 0 && (
                <div className="mb-8">
                    <h2 className="font-display text-lg font-semibold text-black mb-3">
                        Existing Categories ({categories.length})
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <span
                                key={cat.id}
                                className="px-3 py-1.5 text-sm font-medium rounded-md bg-muted"
                            >
                                {cat.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Create form */}
            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <div className="space-y-1.5">
                    <label
                        htmlFor="categoryName"
                        className="text-sm font-medium"
                    >
                        Category Name{" "}
                        <span className="text-red-500">*</span>
                    </label>

                    <Input
                        id="categoryName"
                        placeholder="e.g. T-Shirts, Hoodies, Jeans"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-500 font-medium">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="text-sm text-green-600 font-medium">
                        {success}
                    </p>
                )}

                <Button
                    type="submit"
                    disabled={createCategoryMutation.isPending}
                    className="w-full"
                >
                    {createCategoryMutation.isPending
                        ? "Creating..."
                        : "Create Category"}
                </Button>
            </form>
        </div>
    );
}
