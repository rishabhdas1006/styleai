import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAddCartItemMutation } from "@/api/cart";
import { useAuth } from "@/lib/authStore";
import type { ProductDetail, ProductVariant } from "@/types";

interface ProductInfoProps {
    product: ProductDetail;
    selectedColor: string;
    selectedSize: string;
    onColorChange: (color: string) => void;
    onSizeChange: (size: string) => void;
}

export default function ProductInfo({
    product,
    selectedColor,
    selectedSize,
    onColorChange,
    onSizeChange,
}: ProductInfoProps) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const addCartItemMutation = useAddCartItemMutation();

    const [wishlisted, setWishlisted] = useState(false);

    /*
     * ---------------------------------------------------------
     * Variant helpers
     * ---------------------------------------------------------
     */

    // Variants belonging to the currently selected color
    const colorVariants = useMemo(() => {
        return product.variants.filter(
            (variant) => variant.color === selectedColor
        );
    }, [product.variants, selectedColor]);

    // Find the exact selected variant
    const selectedVariant = useMemo<ProductVariant | undefined>(() => {
        return product.variants.find(
            (variant) =>
                variant.color === selectedColor &&
                variant.size === selectedSize
        );
    }, [product.variants, selectedColor, selectedSize]);

    const availableSizesForColor = useMemo(() => {
        return [...new Set(colorVariants.map((variant) => variant.size))];
    }, [colorVariants]);

    const handleColorChange = (color: string) => {
        onColorChange(color);
    };

    const handleSizeChange = (size: string) => {
        const variant = colorVariants.find(
            (variant) => variant.size === size
        );

        if (!variant || variant.stock <= 0) {
            return;
        }

        onSizeChange(size);
    };

    /*
     * ---------------------------------------------------------
     * Cart
     * ---------------------------------------------------------
     */

    const handleAddToCart = async () => {
        if (!selectedVariant) return;

        if (selectedVariant.stock <= 0) return;

        if (!isAuthenticated) {
            navigate("/login", {
                state: {
                    pendingCartItem: {
                        variantId: selectedVariant.id,
                        quantity: 1,
                    },
                },
            });

            return;
        }

        try {
            await addCartItemMutation.mutateAsync({
                variantId: selectedVariant.id,
                quantity: 1,
            });
        } catch {
            // TODO: show toast notification on error
        }
    };

    const isOutOfStock =
        selectedVariant !== undefined && selectedVariant.stock <= 0;

    /*
     * ---------------------------------------------------------
     * UI
     * ---------------------------------------------------------
     */

    return (
        <div className="flex flex-col">

            {/* Name + wishlist */}
            <div className="flex items-start justify-between gap-4">
                <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight">
                    {product.name}
                </h1>

                <button
                    onClick={() => setWishlisted((prev) => !prev)}
                    className="flex-shrink-0 flex items-center justify-center size-9 rounded-sm border border-foreground/15 hover:bg-foreground/5"
                    aria-label={
                        wishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }
                >
                    <Heart
                        className={cn(
                            "size-4",
                            wishlisted && "fill-current"
                        )}
                        strokeWidth={1.5}
                    />
                </button>
            </div>

            {/* Price */}
            <div className="mt-1 md:mt-2">
                <p className="hidden md:block text-xl font-bold">
                    ${selectedVariant?.price ?? product.price}
                </p>

                <div className="flex items-baseline gap-3 md:mt-1">
                    <p className="text-sm text-muted-foreground">
                        MRP incl. of all taxes
                    </p>

                    <p className="md:hidden text-lg font-bold">
                        ${selectedVariant?.price ?? product.price}
                    </p>
                </div>
            </div>

            {/* Description */}
            <p className="mt-4 md:mt-6 text-sm md:text-base font-semibold leading-relaxed">
                {product.description}
            </p>

            {/* ------------------------------------------------ */}
            {/* COLOR */}
            {/* ------------------------------------------------ */}

            <div className="mt-6 md:mt-8">
                <p className="text-sm font-medium mb-2.5">
                    Color
                </p>

                <div className="flex gap-2">
                    {product.availableColors.map((color) => {
                        /*
                         * Find variants belonging to this color.
                         */
                        const variantsForColor =
                            product.variants.filter(
                                (variant) =>
                                    variant.color === color.hex
                            );

                        /*
                         * A color is considered unavailable only when
                         * all its variants are out of stock.
                         */
                        const colorOutOfStock =
                            variantsForColor.length === 0 ||
                            variantsForColor.every(
                                (variant) => variant.stock <= 0
                            );

                        return (
                            <button
                                key={color.hex}
                                onClick={() =>
                                    !colorOutOfStock &&
                                    handleColorChange(color.hex)
                                }
                                disabled={colorOutOfStock}
                                title={
                                    colorOutOfStock
                                        ? `${color.name} - Out of stock`
                                        : color.name
                                }
                                aria-label={color.name}
                                className={cn(
                                    "size-10 md:size-11 rounded-sm transition-all",
                                    selectedColor === color.hex &&
                                    "ring-2 ring-foreground ring-offset-2",
                                    selectedColor !== color.hex &&
                                    !colorOutOfStock &&
                                    "ring-1 ring-foreground/10 hover:ring-foreground/30",
                                    colorOutOfStock &&
                                    "opacity-30 cursor-not-allowed"
                                )}
                                style={{
                                    backgroundColor: color.hex,
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* ------------------------------------------------ */}
            {/* SIZE */}
            {/* ------------------------------------------------ */}

            <div className="mt-6">
                <p className="text-sm font-medium mb-2.5">
                    Size
                </p>

                <div className="flex flex-wrap gap-2">
                    {availableSizesForColor.map((size) => {
                        const variant = colorVariants.find(
                            (variant) =>
                                variant.size === size
                        );

                        const outOfStock =
                            !variant || variant.stock <= 0;

                        return (
                            <button
                                key={size}
                                onClick={() =>
                                    handleSizeChange(size)
                                }
                                disabled={outOfStock}
                                className={cn(
                                    "flex items-center justify-center h-10 w-12 rounded-sm border text-sm font-medium transition-colors",

                                    selectedSize === size &&
                                        !outOfStock
                                        ? "border-foreground bg-foreground text-background"
                                        : outOfStock
                                            ? "border-foreground/10 text-foreground/30 cursor-not-allowed"
                                            : "border-foreground/20 text-foreground hover:border-foreground"
                                )}
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>

                {/* Size guide */}
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground uppercase tracking-wider">
                    <button className="hover:text-foreground transition-colors">
                        Find Your Size
                    </button>

                    <span>|</span>

                    <button className="hover:text-foreground transition-colors">
                        Measurement Guide
                    </button>
                </div>
            </div>

            {/* ------------------------------------------------ */}
            {/* ADD TO CART */}
            {/* ------------------------------------------------ */}

            <button
                onClick={handleAddToCart}
                disabled={
                    !selectedVariant ||
                    isOutOfStock ||
                    addCartItemMutation.isPending
                }
                className={cn(
                    "mt-6 md:mt-8 w-full h-12 rounded-sm text-sm font-bold uppercase tracking-wider transition-colors",

                    !selectedVariant ||
                        isOutOfStock ||
                        addCartItemMutation.isPending
                        ? "bg-foreground/10 text-foreground/40 cursor-not-allowed"
                        : "bg-foreground/15 text-foreground hover:bg-foreground/25"
                )}
            >
                {isOutOfStock
                    ? "OUT OF STOCK"
                    : addCartItemMutation.isPending
                        ? "ADDING..."
                        : "ADD"}
            </button>
        </div>
    );
}