import { useCallback, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    ArrowLeft,
    ChevronRight,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useGetPaginatedProductsQuery } from "@/api/products";
import type { Product, ProductsQueryParams } from "@/types";

import CategoryChips from "@/components/products/CategoryChips";
import FilterSidebar from "@/components/products/FilterSidebar";
import ProductGridCard from "@/components/products/ProductGridCard";

const fallbackProducts: Product[] = [
    {
        id: 9201,
        name: "Draped linen shirt",
        category: "Woman",
        brand: "StyleAI",
        price: 89,
        image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 9202,
        name: "Relaxed black blazer",
        category: "Man",
        brand: "StyleAI",
        price: 149,
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 9203,
        name: "Structured cotton dress",
        category: "Woman",
        brand: "StyleAI",
        price: 119,
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 9204,
        name: "Minimal wide trousers",
        category: "Essentials",
        brand: "StyleAI",
        price: 99,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 9205,
        name: "Clean evening layer",
        category: "Editorial",
        brand: "StyleAI",
        price: 129,
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 9206,
        name: "Everyday cotton shirt",
        category: "Essentials",
        brand: "StyleAI",
        price: 79,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
    },
];

export interface ProductFilters {
    search: string;
    categoryChip: string;
    sizes: string[];
    availability: ("in-stock" | "out-of-stock")[];
    category: string;
    brand: string;
    gender: string;
    colors: string[];
    minPrice: number | null;
    maxPrice: number | null;
    sort: string;
    collection: string;
    tags: string[];
    rating: number | null;
}

const initialFilters: ProductFilters = {
    search: "",
    categoryChip: "NEW",
    sizes: [],
    availability: [],
    category: "",
    brand: "",
    gender: "",
    colors: [],
    minPrice: null,
    maxPrice: null,
    sort: "",
    collection: "",
    tags: [],
    rating: null,
};

export default function ProductsPage() {
    const [searchParams] = useSearchParams();
    const initialGender = searchParams.get("gender") ?? "";
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filters, setFilters] = useState<ProductFilters>({
        ...initialFilters,
        gender: initialGender,
    });
    const [page, setPage] = useState(1);
    const limit = 9;

    const [appliedFilters, setAppliedFilters] =
        useState<Partial<ProductsQueryParams>>({
            gender: initialGender || undefined,
        });

    const handleApplyFilters = useCallback(() => {
        setAppliedFilters({
            search: filters.search || undefined,
            gender: filters.gender || undefined,
            category: filters.category || undefined,
            brand: filters.brand || undefined,
            color: filters.colors[0] || undefined,
            size: filters.sizes[0] || undefined,
            minPrice: filters.minPrice ?? undefined,
            maxPrice: filters.maxPrice ?? undefined,
            sort: filters.sort || undefined,
        });

        setPage(1);
        setFiltersOpen(false);
    }, [filters]);

    const handleResetFilters = useCallback(() => {
        setFilters(initialFilters);
        setAppliedFilters({});
        setPage(1);
    }, []);

    const { data: result, isLoading } = useGetPaginatedProductsQuery({
        page,
        limit,
        ...appliedFilters,
    });

    const apiProducts = result?.data ?? [];
    const products = apiProducts.length ? apiProducts : fallbackProducts;
    const totalPages = result?.totalPages ?? 1;
    const totalItems = result?.total ?? products.length;

    return (
        <div className="min-h-screen bg-white text-black">
            <section className="border-y border-black/10 px-4 py-12 md:px-8 md:py-16">
                <div className="mb-8 flex items-center gap-1.5 text-xs uppercase text-black/45">
                    <Link to="/" className="transition-colors hover:text-black">
                        Home
                    </Link>
                    <span>/</span>
                    <span className="text-black">Products</span>
                </div>

                <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-end">
                    <div>
                        <p className="mb-5 text-xs uppercase text-black/50">
                            Collection index
                        </p>
                        <h1 className="m-0 max-w-4xl text-[clamp(4rem,12vw,10rem)] font-normal uppercase leading-[0.82] text-black">
                            Shop
                        </h1>
                    </div>

                    <div className="max-w-xl text-sm leading-6 text-black/60 md:justify-self-end md:text-right">
                        Pieces selected for shape, proportion, and quiet everyday
                        wear. Use search and filters only when you need them.
                    </div>
                </div>
            </section>

            <section className="px-4 py-6 md:px-8 md:py-8">
                <div className="mb-6 grid gap-4 md:grid-cols-[17rem_1fr] md:items-start">
                    <aside className="hidden md:block">
                        <div className="sticky top-28 border-r border-black/10 pr-8">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="m-0 text-xs font-normal uppercase text-black">
                                    Filters
                                </h2>
                                <span className="text-xs uppercase text-black/40">
                                    {totalItems} items
                                </span>
                            </div>
                            <FilterSidebar
                                filters={filters}
                                onChange={setFilters}
                                onReset={handleResetFilters}
                                onApply={handleApplyFilters}
                            />
                        </div>
                    </aside>

                    <div className="min-w-0">
                        <div className="mb-5 flex flex-col gap-4 border-b border-black/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
                            <div className="relative w-full lg:max-w-sm">
                                <Search
                                    className="absolute left-0 top-1/2 size-4 -translate-y-1/2 text-black/45"
                                    strokeWidth={1.4}
                                />

                                <Input
                                    type="search"
                                    placeholder="Search"
                                    value={filters.search}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            search: e.target.value,
                                        }))
                                    }
                                    className="h-11 rounded-none border-0 border-b border-black/20 bg-transparent pl-7 pr-2 text-sm text-black placeholder:text-black/35 focus-visible:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                            </div>

                            <div className="min-w-0 flex-1 lg:max-w-3xl">
                                <CategoryChips
                                    activeChip={filters.categoryChip}
                                    onChange={(categoryChip) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            categoryChip,
                                        }))
                                    }
                                />
                            </div>
                        </div>

                        <div className="mb-5 flex items-center justify-between md:hidden">
                            <span className="text-xs uppercase text-black/45">
                                {totalItems} items
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    setFiltersOpen((open) => !open)
                                }
                                className="inline-flex h-10 items-center gap-2 border border-black px-4 text-xs uppercase text-black"
                            >
                                {filtersOpen ? (
                                    <X className="size-4" strokeWidth={1.4} />
                                ) : (
                                    <SlidersHorizontal className="size-4" strokeWidth={1.4} />
                                )}
                                Filters
                            </button>
                        </div>

                        {filtersOpen && (
                            <div className="mb-6 border border-black/10 p-4 md:hidden">
                                <FilterSidebar
                                    filters={filters}
                                    onChange={setFilters}
                                    onReset={handleResetFilters}
                                    onApply={handleApplyFilters}
                                />
                            </div>
                        )}

                        {isLoading ? (
                            <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-4 lg:grid-cols-3">
                                {Array.from({ length: limit }).map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="mb-3 aspect-[3/4] bg-black/5" />
                                        <div className="mb-2 h-3 w-16 bg-black/5" />
                                        <div className="h-4 w-32 bg-black/5" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-4 md:gap-y-10">
                                {products.map((product, index) => (
                                    <ProductGridCard
                                        key={product.id}
                                        product={product}
                                        fallbackImage={fallbackProducts[index % fallbackProducts.length].image}
                                    />
                                ))}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPage((p) => Math.max(1, p - 1))
                                    }
                                    disabled={page === 1}
                                    className="flex size-10 items-center justify-center border border-black/20 text-black transition-colors hover:border-black hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-30"
                                    aria-label="Previous page"
                                >
                                    <ArrowLeft
                                        className="size-4"
                                        strokeWidth={1.5}
                                    />
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1
                                ).map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPage(p)}
                                        className={cn(
                                            "flex size-10 items-center justify-center border text-sm transition-colors",
                                            p === page
                                                ? "border-black bg-black text-white"
                                                : "border-black/20 text-black hover:border-black"
                                        )}
                                    >
                                        {p}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setPage((p) =>
                                            Math.min(totalPages, p + 1)
                                        )
                                    }
                                    disabled={page === totalPages}
                                    className="flex size-10 items-center justify-center border border-black/20 text-black transition-colors hover:border-black hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-30"
                                    aria-label="Next page"
                                >
                                    <ChevronRight
                                        className="size-4"
                                        strokeWidth={1.5}
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
