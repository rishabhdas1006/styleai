import { Link } from "react-router-dom";
import type { Product } from "@/types";

interface ProductGridCardProps {
    product: Product;
    fallbackImage?: string;
}

export default function ProductGridCard({
    product,
    fallbackImage,
}: ProductGridCardProps) {
    const image = product.image || fallbackImage;

    return (
        <Link
            to={`/products/${product.id}`}
            className="group block text-left"
        >
            <div className="mb-3 aspect-[3/4] overflow-hidden bg-neutral-100">
                {image ? (
                    <img
                        src={image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs uppercase text-black/35">
                        StyleAI
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] uppercase text-black/50">
                    <p>{product.category}</p>

                    {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center gap-1">
                            {product.colors.slice(0, 2).map((color, i) => (
                                <span
                                    key={i}
                                    className="size-2.5 border border-black/10"
                                    style={{ backgroundColor: color }}
                                />
                            ))}

                            {product.colors.length > 2 && (
                                <span className="text-[10px] text-black/40">
                                    +{product.colors.length - 2}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-start justify-between gap-2 text-sm text-black">
                    <p className="leading-tight">{product.name}</p>

                    <p className="whitespace-nowrap">${product.price}</p>
                </div>
            </div>
        </Link>
    );
}
