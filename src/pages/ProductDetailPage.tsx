import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import {
    useGetProductByIdQuery,
    useGetProductVariantsQuery,
} from "@/api/products";

import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";

import type { ProductDetail } from "@/types";

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const productId = Number(id);

    const {
        data: product,
        isLoading: productLoading,
        isError: productError,
    } = useGetProductByIdQuery(productId, !isNaN(productId));

    const {
        data: variants = [],
        isLoading: variantsLoading,
    } = useGetProductVariantsQuery(
        productId,
        !isNaN(productId)
    );

    const isLoading = productLoading || variantsLoading;

    /*
     * ---------------------------------------------------------
     * Product detail
     * ---------------------------------------------------------
     */

    const productDetail: ProductDetail | undefined = product
        ? {
            ...product,
            variants,

            images: product.images?.length
                ? product.images
                : variants
                    .flatMap((variant) => variant.images)
                    .filter(Boolean).length
                    ? [
                        ...new Set(
                            variants.flatMap(
                                (variant) => variant.images
                            )
                        ),
                    ]
                    : [product.image ?? ""].filter(Boolean),

            availableColors: [
                ...new Map(
                    variants.map((variant) => [
                        variant.color,
                        {
                            name: variant.colorName,
                            hex: variant.color,
                        },
                    ])
                ).values(),
            ],
        }
        : undefined;

    /*
     * ---------------------------------------------------------
     * Selected variant state
     * ---------------------------------------------------------
     */

    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");

    /*
     * Find the first in-stock variant.
     */
    const firstInStockVariant = useMemo(() => {
        return variants.find(
            (variant) => variant.stock > 0
        );
    }, [variants]);

    /*
     * Initialize the selected color when variants load.
     *
     * Prefer the first color that has an in-stock variant.
     */
    useEffect(() => {
        if (!variants.length) {
            setSelectedColor("");
            setSelectedSize("");
            return;
        }

        const initialVariant =
            firstInStockVariant ?? variants[0];

        setSelectedColor(initialVariant.color);
        setSelectedSize("");
    }, [productId, variants, firstInStockVariant]);

    /*
     * ---------------------------------------------------------
     * Selected exact variant
     * ---------------------------------------------------------
     */

    const selectedVariant = useMemo(() => {
        if (!selectedColor || !selectedSize) {
            return undefined;
        }

        return variants.find(
            (variant) =>
                variant.color === selectedColor &&
                variant.size === selectedSize
        );
    }, [
        variants,
        selectedColor,
        selectedSize,
    ]);

    /*
     * ---------------------------------------------------------
     * Variant used by image gallery
     * ---------------------------------------------------------
     *
     * Priority:
     *
     * 1. Selected variant if it has stock
     * 2. First in-stock variant for selected color
     * 3. First in-stock variant overall
     * 4. First variant
     */

    const galleryVariant = useMemo(() => {
        if (selectedVariant && selectedVariant.stock > 0) {
            return selectedVariant;
        }

        const selectedColorVariant = variants.find(
            (variant) =>
                variant.color === selectedColor &&
                variant.stock > 0
        );

        if (selectedColorVariant) {
            return selectedColorVariant;
        }

        if (firstInStockVariant) {
            return firstInStockVariant;
        }

        return variants[0];
    }, [
        variants,
        selectedVariant,
        selectedColor,
        firstInStockVariant,
    ]);

    if (isLoading) {
        return (
            <div className="px-6 md:px-10 py-8">
                <div className="animate-pulse max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                        <div className="flex-1">
                            <div className="aspect-[4/5] bg-foreground/5 rounded-sm" />
                        </div>

                        <div className="md:w-[400px] space-y-4">
                            <div className="h-8 bg-foreground/5 rounded w-48" />
                            <div className="h-6 bg-foreground/5 rounded w-20" />
                            <div className="h-4 bg-foreground/5 rounded w-40 mt-6" />
                            <div className="h-20 bg-foreground/5 rounded mt-4" />

                            <div className="flex gap-2 mt-6">
                                {Array.from({ length: 6 }).map(
                                    (_, i) => (
                                        <div
                                            key={i}
                                            className="size-11 bg-foreground/5 rounded-sm"
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (productError || !productDetail) {
        return (
            <div className="px-6 md:px-10 py-20 text-center">
                <h1 className="font-display text-2xl font-bold">
                    Product not found
                </h1>

                <p className="mt-2 text-muted-foreground">
                    The product you're looking for doesn't exist.
                </p>

                <button
                    onClick={() => navigate("/products")}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
                >
                    <ArrowLeft
                        className="size-4"
                        strokeWidth={1.5}
                    />
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="px-6 md:px-10 pb-10">

            {/* Mobile back button */}
            <button
                onClick={() => navigate(-1)}
                className="md:hidden flex items-center gap-2 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Go back"
            >
                <ArrowLeft
                    className="size-5"
                    strokeWidth={1.5}
                />
            </button>

            {/* Desktop */}
            <div className="hidden md:flex gap-12 max-w-6xl mx-auto py-6">

                <div className="flex-1 max-w-[600px]">
                    <ProductImageGallery
                        images={
                            galleryVariant?.images?.length
                                ? galleryVariant.images
                                : productDetail.images
                        }
                        productName={productDetail.name}
                    />
                </div>

                <div className="w-[380px] flex-shrink-0">
                    <ProductInfo
                        product={productDetail}
                        selectedColor={selectedColor}
                        selectedSize={selectedSize}
                        onColorChange={(color) => {
                            setSelectedColor(color);
                            setSelectedSize("");
                        }}
                        onSizeChange={setSelectedSize}
                    />
                </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden">

                <ProductImageGallery
                    images={
                        galleryVariant?.images?.length
                            ? galleryVariant.images
                            : productDetail.images
                    }
                    productName={productDetail.name}
                />

                <div className="mt-5">
                    <ProductInfo
                        product={productDetail}
                        selectedColor={selectedColor}
                        selectedSize={selectedSize}
                        onColorChange={(color) => {
                            setSelectedColor(color);
                            setSelectedSize("");
                        }}
                        onSizeChange={setSelectedSize}
                    />
                </div>
            </div>
        </div>
    );
}