import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useGetPaginatedProductsQuery } from "@/api/products";
import type { Product } from "@/types";

const tabs = ["All", "Man", "Woman", "Essentials"] as const;

const fallbackProducts: Product[] = [
    {
        id: 9101,
        name: "Monochrome tailoring",
        category: "Man",
        brand: "StyleAI",
        price: 159,
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 9102,
        name: "Soft summer whites",
        category: "Woman",
        brand: "StyleAI",
        price: 129,
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 9103,
        name: "Clean evening pieces",
        category: "Essentials",
        brand: "StyleAI",
        price: 109,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
    },
];

export default function CollectionsSection() {
    const [activeTab, setActiveTab] = useState<string>("All");

    const category =
        activeTab === "All" ? undefined : activeTab.toLowerCase();

    const { data } = useGetPaginatedProductsQuery({
        page: 1,
        limit: 3,
        category,
    });

    const products = data?.data?.length ? data.data : fallbackProducts;

    return (
        <section className="bg-white px-4 py-16 md:px-8 md:py-24">
            <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
                <div className="text-left">
                    <p className="mb-5 text-xs uppercase text-black/50">Collection 01</p>
                    <h2 className="m-0 max-w-xl text-4xl font-normal uppercase leading-none text-black md:text-7xl">
                        Essentials for the new season
                    </h2>
                </div>

                <div>
                    <div className="mb-5 flex flex-wrap items-center gap-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "text-xs uppercase transition-colors",
                                    activeTab === tab
                                        ? "text-black underline underline-offset-4"
                                        : "text-black/40 hover:text-black"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {products.map((product, index) => {
                            const image =
                                product.image ||
                                fallbackProducts[index % fallbackProducts.length].image;

                            return (
                                <Link
                                    key={product.id}
                                    to={`/products/${product.id}`}
                                    className="group block text-left"
                                >
                                    <div className="mb-3 aspect-[3/4] overflow-hidden bg-neutral-100">
                                        <img
                                            src={image}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[11px] uppercase text-black/50">
                                            {product.category}
                                        </p>

                                        <div className="flex items-start justify-between gap-2 text-sm text-black">
                                            <p className="leading-tight">
                                                {product.name}
                                            </p>

                                            <p className="whitespace-nowrap">
                                                ${product.price}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <Link
                        to="/products"
                        className="mt-8 inline-flex h-11 items-center justify-center border border-black px-8 text-xs uppercase text-black transition-colors hover:bg-black hover:text-white"
                    >
                        View collection
                    </Link>
                </div>
            </div>
        </section>
    );
}
