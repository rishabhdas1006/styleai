import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeading } from "@/components/ui/heading";

import { useAuth } from "@/lib/authStore";
import { getApiErrorMessage } from "@/lib/apiError";

import { useCreateProductMutation } from "@/api/products";

import AsyncSearchSelect from "@/components/search/AsyncSearchSelect";
import { searchCategories } from "@/lib/categorySearch";

import PrimaryImagePicker from "@/components/admin/products/PrimaryImagePicker";

import {
    cleanupProductImage,
    uploadProductPrimaryImage,
} from "@/api/cloudinary";

import type { Category } from "@/types";

const genders = ["men", "women", "kids", "unisex"];

export default function CreateProductForm() {
    const navigate = useNavigate();

    const { role } = useAuth();

    const createProductMutation =
        useCreateProductMutation();

    const [selectedCategory, setSelectedCategory] =
        useState<Category | null>(null);

    const [primaryImage, setPrimaryImage] =
        useState<File | null>(null);

    const [uploadProgress, setUploadProgress] =
        useState(0);

    const [isUploadingImage, setIsUploadingImage] =
        useState(false);

    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        description: "",
        brand: "",
        category_id: 0,
        gender: "",
    });

    const isSubmitting =
        isUploadingImage ||
        createProductMutation.isPending;

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCategoryChange = (
        category: Category | null
    ) => {
        setSelectedCategory(category);

        setForm((prev) => ({
            ...prev,
            category_id: category?.id ?? 0,
        }));
    };

    const validateForm = (): string | null => {
        if (!form.name.trim()) {
            return "Product name is required.";
        }

        if (!form.brand.trim()) {
            return "Brand is required.";
        }

        if (!form.category_id) {
            return "Please select a category.";
        }

        if (!form.gender) {
            return "Please select a gender.";
        }

        if (!primaryImage) {
            return "Please select a primary image.";
        }

        return null;
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (isSubmitting) {
            return;
        }

        setError("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        setIsUploadingImage(true);
        setUploadProgress(0);

        try {
            /*
             * 1. Upload the primary image.
             */
            const {
                uploaded,
                folder,
            } = await uploadProductPrimaryImage({
                file: primaryImage!,
                onProgress: setUploadProgress,
            });

            /*
             * 2. Create the product.
             */
            try {
                const result =
                    await createProductMutation.mutateAsync({
                        name: form.name.trim(),
                        description:
                            form.description.trim(),
                        brand: form.brand.trim(),
                        category_id: form.category_id,
                        gender: form.gender,

                        primary_image_url:
                            uploaded.url,

                        primary_image_public_id:
                            uploaded.public_id,
                    });

                /*
                 * Product successfully created.
                 *
                 * The image is now owned by the product,
                 * so DON'T clean it up.
                 */
                navigate(
                    `/admin/products/${result.id}/variants`
                );
            } catch (err) {
                /*
                 * Product creation failed after
                 * Cloudinary upload succeeded.
                 *
                 * Remove the orphaned image.
                 */
                try {
                    await cleanupProductImage(folder);
                } catch (cleanupError) {
                    console.error(
                        "Failed to cleanup product image:",
                        cleanupError
                    );
                }

                throw err;
            }
        } catch (err: unknown) {
            setError(
                getApiErrorMessage(
                    err,
                    "Failed to create product"
                )
            );
        } finally {
            setIsUploadingImage(false);
            setUploadProgress(0);
        }
    };

    /*
     * This isn't strictly necessary because the page
     * already protects admin access, but keeping this
     * here prevents accidental use of the form elsewhere.
     */
    if (role !== "admin") {
        return null;
    }

    return (
        <div className="mx-auto max-w-2xl px-6 py-10">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Link
                    to="/admin"
                    className="transition-colors hover:text-foreground"
                >
                    Admin
                </Link>

                <span>/</span>

                <span className="text-foreground">
                    Create Product
                </span>
            </div>

            {/* Heading */}
            <PageHeading
                title="CREATE PRODUCT"
                subtitle="Add a new product to the store."
                className="mb-8"
            />

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                {/* Product Name */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="name"
                        className="text-sm font-medium"
                    >
                        Product Name{" "}
                        <span className="text-red-500">
                            *
                        </span>
                    </label>

                    <Input
                        id="name"
                        name="name"
                        placeholder="e.g. Classic T-Shirt"
                        value={form.name}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="description"
                        className="text-sm font-medium"
                    >
                        Description
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        placeholder="Product description..."
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        disabled={isSubmitting}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                {/* Brand */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="brand"
                        className="text-sm font-medium"
                    >
                        Brand{" "}
                        <span className="text-red-500">
                            *
                        </span>
                    </label>

                    <Input
                        id="brand"
                        name="brand"
                        placeholder="e.g. Nike"
                        value={form.brand}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="category_id"
                        className="text-sm font-medium"
                    >
                        Category{" "}
                        <span className="text-red-500">
                            *
                        </span>
                    </label>

                    <AsyncSearchSelect<Category>
                        id="category_id"
                        selectedOption={selectedCategory}
                        onChange={handleCategoryChange}
                        search={searchCategories}
                        getOptionKey={(category) =>
                            category.id
                        }
                        getOptionLabel={(category) =>
                            category.name
                        }
                        minCharacters={2}
                        debounceMs={350}
                        placeholder="Type at least 2 characters to search categories"
                        emptyMessage="No matching categories found."
                        disabled={isSubmitting}
                    />
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="gender"
                        className="text-sm font-medium"
                    >
                        Gender{" "}
                        <span className="text-red-500">
                            *
                        </span>
                    </label>

                    <select
                        id="gender"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="" disabled>
                            Select gender
                        </option>

                        {genders.map((gender) => (
                            <option
                                key={gender}
                                value={gender}
                            >
                                {gender
                                    .charAt(0)
                                    .toUpperCase() +
                                    gender.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Primary Image */}
                <PrimaryImagePicker
                    image={primaryImage}
                    onChange={setPrimaryImage}
                    disabled={isSubmitting}
                />

                {/* Upload Progress */}
                {isUploadingImage && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                                Uploading primary image...
                            </span>

                            <span>
                                {uploadProgress}%
                            </span>
                        </div>

                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full bg-foreground transition-all"
                                style={{
                                    width: `${uploadProgress}%`,
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <p className="font-medium text-sm text-red-500">
                        {error}
                    </p>
                )}

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                >
                    {isUploadingImage
                        ? "Uploading Image..."
                        : createProductMutation.isPending
                            ? "Creating..."
                            : "Create Product & Add Variants"}
                </Button>
            </form>
        </div>
    );
}