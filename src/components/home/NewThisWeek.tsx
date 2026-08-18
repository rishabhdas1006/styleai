import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetProductsQuery } from "@/api/products";
import type { Product } from "@/types";

const fallbackProducts: Product[] = [
    {
        id: 9001,
        name: "Draped linen shirt",
        category: "Woman",
        brand: "StyleAI",
        price: 89,
        image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85",
    },
    {
        id: 9002,
        name: "Relaxed black blazer",
        category: "Man",
        brand: "StyleAI",
        price: 149,
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=85",
    },
    {
        id: 9003,
        name: "Structured cotton dress",
        category: "Woman",
        brand: "StyleAI",
        price: 119,
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=85",
    },
    {
        id: 9004,
        name: "Minimal wide trousers",
        category: "Essentials",
        brand: "StyleAI",
        price: 99,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85",
    },
];

export default function NewThisWeek() {
    const { data } = useGetProductsQuery();
    const products = data?.length ? data : fallbackProducts;
    const [currentIndex, setCurrentIndex] = useState(0);

    const itemsPerPage = 4;

    const prev = () =>
        setCurrentIndex((i) => Math.max(0, i - itemsPerPage));

    const next = () =>
        setCurrentIndex((i) =>
            i + itemsPerPage >= products.length ? 0 : i + itemsPerPage
        );

    const visibleProducts = products.slice(
        currentIndex,
        currentIndex + itemsPerPage
    );

    return (
        <section className="border-b border-black/10 bg-white px-4 py-16 md:px-8 md:py-24">
            <div className="mb-8 flex items-end justify-between gap-6 md:mb-12">
                <h2 className="m-0 text-left text-3xl font-normal uppercase leading-none text-black md:text-6xl">
                    New this week
                    <sup className="ml-2 align-super text-xs md:text-sm">
                        ({products.length})
                    </sup>
                </h2>

                <Link to="/products" className="text-xs uppercase underline underline-offset-4">
                    See all
                </Link>
            </div>

            <div className="hidden grid-cols-4 gap-3 md:grid">
                {visibleProducts.map((product, index) => (
                    <NewThisWeekCard
                        key={product.id}
                        product={product}
                        fallbackImage={fallbackProducts[index % fallbackProducts.length].image}
                    />
                ))}
            </div>

            <div className="-mx-4 overflow-x-auto px-4 md:hidden">
                <div className="flex snap-x gap-3">
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className="w-56 flex-shrink-0 snap-start"
                        >
                            <NewThisWeekCard
                                product={product}
                                fallbackImage={fallbackProducts[index % fallbackProducts.length].image}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 hidden justify-end gap-2 md:flex">
                <button
                    onClick={prev}
                    className="flex size-10 items-center justify-center border border-black text-black transition-colors hover:bg-black hover:text-white"
                    aria-label="Previous"
                    type="button"
                >
                    <ChevronLeft className="size-4" strokeWidth={1.5} />
                </button>

                <button
                    onClick={next}
                    className="flex size-10 items-center justify-center border border-black text-black transition-colors hover:bg-black hover:text-white"
                    aria-label="Next"
                    type="button"
                >
                    <ChevronRight className="size-4" strokeWidth={1.5} />
                </button>
            </div>
        </section>
    );
}

function NewThisWeekCard({
    product,
    fallbackImage,
}: {
    product: Product;
    fallbackImage: string;
}) {
    const image = product.image || fallbackImage;

    return (
        <Link to={`/products/${product.id}`} className="group block">
            <div className="relative mb-3 aspect-[3/4] overflow-hidden bg-neutral-100">
                <img
                    src={image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                />
            </div>

            <div className="space-y-1 text-left">
                <p className="text-[11px] uppercase text-black/50">
                    {product.category}
                </p>

                <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-normal leading-tight text-black">
                        {product.name}
                    </p>

                    <p className="whitespace-nowrap text-sm text-black">
                        ${product.price}
                    </p>
                </div>
            </div>
        </Link>
    );
}
