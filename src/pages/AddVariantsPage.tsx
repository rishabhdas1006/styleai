import { useEffect, useState } from "react";
import {
    useParams,
    Link,
    useLocation,
    useNavigate,
    Navigate,
} from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/authStore";
import { getApiErrorMessage } from "@/lib/apiError";

import {
    useCreateVariantMutation,
    useDeleteVariantMutation,
    useGetProductByIdQuery,
    useGetProductVariantsQuery,
    useUpdateVariantMutation,
} from "@/api/products";

import {
    cleanupVariantImages,
    uploadVariantImages,
} from "@/api/cloudinary";

import NewVariantCard, {
    type VariantForm,
} from "@/components/admin/variants/NewVariantCard";

import ExistingVariantsTable, {
    type EditedVariant,
} from "@/components/admin/variants/ExistingVariantsTable";

const emptyVariant: VariantForm = {
    size: "",
    color: "",
    price: "",
    stock: "",
    images: [],
};

export default function AddVariantsPage() {
    const { isAuthenticated, role } = useAuth();

    const { id } = useParams<{ id: string }>();
    const productId = Number(id);

    const location = useLocation();
    const navigate = useNavigate();

    const { data: product } = useGetProductByIdQuery(
        productId,
        Boolean(productId)
    );

    const {
        data: existingVariants = [],
        refetch,
    } = useGetProductVariantsQuery(
        productId,
        Boolean(productId)
    );

    const createVariantMutation =
        useCreateVariantMutation();

    const updateVariantMutation =
        useUpdateVariantMutation();

    const deleteVariantMutation =
        useDeleteVariantMutation();

    const [variants, setVariants] = useState<VariantForm[]>([
        { ...emptyVariant },
    ]);

    const [editedVariants, setEditedVariants] =
        useState<Record<string, EditedVariant>>({});

    const [updatingVariantId, setUpdatingVariantId] =
        useState<string | null>(null);

    const [deletingVariantId, setDeletingVariantId] =
        useState<string | null>(null);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [uploadingVariantIndex, setUploadingVariantIndex] =
        useState<number | null>(null);

    const [uploadingImageIndex, setUploadingImageIndex] =
        useState<number | null>(null);

    const [uploadProgress, setUploadProgress] =
        useState(0);

    const [completedImages, setCompletedImages] =
        useState(0);

    const [totalImages, setTotalImages] =
        useState(0);

    const overallUploadProgress =
        totalImages > 0
            ? Math.round(
                ((completedImages +
                    uploadProgress / 100) /
                    totalImages) *
                100
            )
            : 0;

    /*
     * Initialize editable values for existing variants.
     */
    useEffect(() => {
        const initialValues: Record<
            string,
            EditedVariant
        > = {};

        existingVariants.forEach((variant) => {
            initialValues[variant.id] = {
                price: String(variant.price),
                stock: String(variant.stock),
            };
        });

        setEditedVariants(initialValues);
    }, [existingVariants]);

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    if (role !== "admin") {
        return <Navigate to="/" replace />;
    }

    /*
     * -----------------------------
     * New variant form
     * -----------------------------
     */

    const updateVariant = (
        index: number,
        field: keyof VariantForm,
        value: string
    ) => {
        setVariants((prev) =>
            prev.map((variant, i) =>
                i === index
                    ? {
                        ...variant,
                        [field]: value,
                    }
                    : variant
            )
        );
    };

    const updateVariantImages = (
        index: number,
        images: File[]
    ) => {
        setVariants((prev) =>
            prev.map((variant, i) =>
                i === index
                    ? {
                        ...variant,
                        images,
                    }
                    : variant
            )
        );
    };

    const addVariantRow = () => {
        setVariants((prev) => [
            ...prev,
            { ...emptyVariant },
        ]);
    };

    const removeVariantRow = (index: number) => {
        setVariants((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    /*
     * -----------------------------
     * Existing variant editing
     * -----------------------------
     */

    const updateExistingVariantField = (
        variantId: string,
        field: keyof EditedVariant,
        value: string
    ) => {
        setEditedVariants((prev) => ({
            ...prev,
            [variantId]: {
                ...prev[variantId],
                [field]: value,
            },
        }));
    };

    const handleUpdateVariant = async (
        variantId: string
    ) => {
        setError("");
        setSuccessMessage("");

        const edited = editedVariants[variantId];

        if (!edited) {
            return;
        }

        const price = Number(edited.price);
        const stock = Number(edited.stock);

        if (
            !edited.price ||
            Number.isNaN(price) ||
            price <= 0
        ) {
            setError("Price must be greater than 0.");
            return;
        }

        if (
            !edited.stock ||
            Number.isNaN(stock) ||
            stock < 0
        ) {
            setError("Stock cannot be negative.");
            return;
        }

        try {
            setUpdatingVariantId(variantId);

            await updateVariantMutation.mutateAsync({
                variantId,
                price,
                stock,
            });

            setSuccessMessage(
                "Variant updated successfully."
            );

            await refetch();
        } catch (err: unknown) {
            setError(
                getApiErrorMessage(
                    err,
                    "Failed to update variant."
                )
            );
        } finally {
            setUpdatingVariantId(null);
        }
    };

    const handleDeleteVariant = async (
        variantId: string
    ) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this variant?"
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setSuccessMessage("");

        try {
            setDeletingVariantId(variantId);

            await deleteVariantMutation.mutateAsync(
                variantId
            );

            setSuccessMessage(
                "Variant deleted successfully."
            );

            await refetch();
        } catch (err: unknown) {
            setError(
                getApiErrorMessage(
                    err,
                    "Failed to delete variant."
                )
            );
        } finally {
            setDeletingVariantId(null);
        }
    };

    /*
     * -----------------------------
     * Create variants
     * -----------------------------
     */

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (isSubmitting) {
            return;
        }

        setError("");
        setSuccessMessage("");

        /*
         * Validate everything BEFORE uploading anything.
         */
        for (const variant of variants) {
            if (
                !variant.size ||
                !variant.color ||
                !variant.price ||
                !variant.stock
            ) {
                setError(
                    "Please fill in all required fields for each variant."
                );
                return;
            }

            if (
                Number.isNaN(Number(variant.price)) ||
                Number(variant.price) <= 0
            ) {
                setError(
                    "Price must be greater than 0."
                );
                return;
            }

            if (
                Number.isNaN(Number(variant.stock)) ||
                Number(variant.stock) < 0
            ) {
                setError(
                    "Stock cannot be negative."
                );
                return;
            }

            if (variant.images.length === 0) {
                setError(
                    `Please select at least one image for ${variant.size} / ${variant.color}.`
                );
                return;
            }
        }

        const total = variants.reduce(
            (sum, variant) =>
                sum + variant.images.length,
            0
        );

        setTotalImages(total);
        setCompletedImages(0);
        setUploadProgress(0);
        setUploadingVariantIndex(null);
        setUploadingImageIndex(null);
        setIsSubmitting(true);

        let created = 0;
        let completedBeforeVariant = 0;

        try {
            for (
                let variantIndex = 0;
                variantIndex < variants.length;
                variantIndex++
            ) {
                const variant =
                    variants[variantIndex];

                const variantId =
                    crypto.randomUUID();

                let uploadStarted = false;

                setUploadingVariantIndex(
                    variantIndex
                );

                setUploadingImageIndex(null);
                setUploadProgress(0);

                try {
                    /*
                     * Upload images to Cloudinary.
                     */
                    uploadStarted = true;

                    const uploadedImages =
                        await uploadVariantImages({
                            productId,
                            variantId,
                            files: variant.images,

                            onImageProgress: (
                                imageIndex,
                                progress
                            ) => {
                                setUploadingImageIndex(
                                    imageIndex
                                );

                                setUploadProgress(
                                    progress
                                );
                            },

                            onImageComplete: (
                                _imageIndex,
                                completed
                            ) => {
                                setCompletedImages(
                                    completedBeforeVariant +
                                    completed
                                );

                                setUploadProgress(0);
                            },
                        });

                    /*
                     * Create the variant in our backend.
                     */
                    await createVariantMutation.mutateAsync({
                        productId,

                        variant: {
                            variantId,
                            size: variant.size,
                            color: variant.color,
                            price: Number(
                                variant.price
                            ),
                            stock: Number(
                                variant.stock
                            ),
                            images: uploadedImages,
                        },
                    });

                    created++;

                    completedBeforeVariant +=
                        variant.images.length;

                } catch (err: unknown) {
                    /*
                     * If Cloudinary upload started, clean up
                     * anything uploaded for this variant.
                     *
                     * This also handles partial uploads where
                     * some images succeeded and a later image failed.
                     */
                    if (uploadStarted) {
                        try {
                            await cleanupVariantImages({
                                productId,
                                variantId,
                            });
                        } catch (cleanupError) {
                            console.error(
                                "Failed to cleanup Cloudinary images:",
                                cleanupError
                            );
                        }
                    }

                    throw err;
                }
            }
        } catch (err: unknown) {
            setError(
                getApiErrorMessage(
                    err,
                    "Failed to create variant."
                )
            );
        } finally {
            setIsSubmitting(false);
            setUploadingVariantIndex(null);
            setUploadingImageIndex(null);
            setUploadProgress(0);
            setCompletedImages(0);
            setTotalImages(0);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
                <Link
                    to="/admin"
                    className="hover:text-foreground transition-colors"
                >
                    Admin
                </Link>

                <span>/</span>

                <Link
                    to="/admin/products/create"
                    className="hover:text-foreground transition-colors"
                >
                    Create Product
                </Link>

                <span>/</span>

                <span className="text-foreground">
                    Add Variants
                </span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight text-black">
                        ADD VARIANTS
                    </h1>

                    {product && (
                        <p className="text-black/60 mt-1">
                            For:{" "}
                            <span className="font-medium text-black">
                                {product.name}
                            </span>{" "}
                            ({product.brand})
                        </p>
                    )}
                </div>

                <Button
                    variant="outline"
                    onClick={() =>
                        navigate(
                            `/products/${productId}`
                        )
                    }
                >
                    View Product
                </Button>
            </div>

            {/* Existing variants */}
            <ExistingVariantsTable
                variants={existingVariants}
                editedVariants={editedVariants}
                updatingVariantId={
                    updatingVariantId
                }
                deletingVariantId={
                    deletingVariantId
                }
                onFieldChange={
                    updateExistingVariantField
                }
                onUpdate={handleUpdateVariant}
                onDelete={handleDeleteVariant}
                disabled={isSubmitting}
            />

            {/* New variants */}
            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <h2 className="font-display text-lg font-semibold text-black">
                    New Variants
                </h2>

                {variants.map(
                    (variant, index) => (
                        <NewVariantCard
                            key={index}
                            variant={variant}
                            index={index}
                            canRemove={
                                variants.length > 1
                            }
                            onChange={
                                updateVariant
                            }
                            onImagesChange={
                                updateVariantImages
                            }
                            onRemove={
                                removeVariantRow
                            }
                            disabled={
                                isSubmitting
                            }
                        />
                    )
                )}

                {/* Add another variant */}
                <button
                    type="button"
                    onClick={addVariantRow}
                    disabled={
                        isSubmitting
                    }
                    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                    <Plus className="size-4" />

                    Add Another Variant
                </button>

                {isSubmitting && totalImages > 0 && (
                    <div className="border rounded-md p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-black">
                                    Uploading images
                                </p>

                                {uploadingVariantIndex !== null && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Variant{" "}
                                        {uploadingVariantIndex + 1}{" "}
                                        of {variants.length}
                                    </p>
                                )}
                            </div>

                            <span className="text-sm font-medium">
                                {overallUploadProgress}%
                            </span>
                        </div>

                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full bg-black transition-all duration-200"
                                style={{
                                    width: `${overallUploadProgress}%`,
                                }}
                            />
                        </div>

                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                                {completedImages} of{" "}
                                {totalImages} images uploaded
                            </span>

                            {uploadingImageIndex !== null && (
                                <span>
                                    Current image:{" "}
                                    {uploadingImageIndex + 1}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Messages */}
                {error && (
                    <p className="text-sm text-red-500 font-medium">
                        {error}
                    </p>
                )}

                {successMessage && !error && (
                    <p className="text-sm text-green-600 font-medium">
                        {successMessage}
                    </p>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <Button
                        type="submit"
                        disabled={
                            isSubmitting
                        }
                        className="flex-1"
                    >
                        {isSubmitting
                            ? "Uploading & Saving..."
                            : "Save Variants"}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={() =>
                            navigate(
                                `/products/${productId}`
                            )
                        }
                    >
                        Done
                    </Button>
                </div>
            </form>
        </div>
    );
}