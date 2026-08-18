import type { Product } from "@/types";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({
    product,
}: ProductCardProps) {
    return (
        <div className="flex-shrink-0 w-40 md:w-48 cursor-pointer group">
            <div className="aspect-[4/5] overflow-hidden rounded-sm bg-white mb-2">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
            </div>

            <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">
                    {product.category}
                </p>

                <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-tight">
                        {product.name}
                    </p>

                    <p className="text-sm font-semibold whitespace-nowrap">
                        ${product.price}
                    </p>
                </div>
            </div>
        </div>
    );
}