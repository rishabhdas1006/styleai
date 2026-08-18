import { X, Plus, Minus, Heart, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    useRemoveCartItemMutation,
    useUpdateCartItemMutation,
} from "@/api/cart";
import type { ServerCartItem } from "@/types";

interface CartItemCardProps {
    item: ServerCartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
    const updateCartItemMutation = useUpdateCartItemMutation();
    const removeCartItemMutation = useRemoveCartItemMutation();

    const image = item.variant.images?.[0];

    return (
        <div className="flex gap-3 md:gap-4">

            {/* Product image with wishlist overlay */}
            <div className="relative flex-shrink-0 w-40 md:w-56 aspect-[4/5] bg-white rounded-sm overflow-hidden">
                {image ? (
                    <img
                        src={image}
                        alt={item.variant.product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                        No image
                    </div>
                )}

                <button
                    className="absolute bottom-2 right-2 flex items-center justify-center size-7 rounded-sm bg-white/80 hover:bg-white transition-colors"
                    aria-label="Add to wishlist"
                >
                    <Heart className="size-3.5" strokeWidth={1.5} />
                </button>
            </div>


            {/* Right side: info + controls */}
            <div className="flex flex-col min-w-0">

                {/* Remove button */}
                <button
                    onClick={() => removeCartItemMutation.mutate(item.id)}
                    className="self-start mb-2 flex items-center justify-center size-6 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Remove item"
                >
                    <X className="size-4" strokeWidth={1.5} />
                </button>


                {/* Size */}
                <p className="text-sm font-medium">
                    {item.variant.size}
                </p>


                {/* Color swatch */}
                <div
                    className="size-6 rounded-sm border border-foreground/10 mt-1.5"
                    style={{ backgroundColor: item.variant.color }}
                    title={item.variant.colorName}
                />


                {/* Quantity controls */}
                <div className="flex flex-col items-center w-8 mt-3 border border-foreground/15 rounded-sm">

                    <button
                        onClick={() =>
                            updateCartItemMutation.mutate({
                                id: item.id,
                                quantity: item.quantity + 1,
                            })
                        }
                        className="flex items-center justify-center w-full h-7 hover:bg-foreground/5 transition-colors"
                        aria-label="Increase quantity"
                    >
                        <Plus className="size-3" strokeWidth={1.5} />
                    </button>

                    <span className="flex items-center justify-center w-full h-7 text-xs font-medium border-y border-foreground/15">
                        {item.quantity}
                    </span>

                    <button
                        onClick={() =>
                            item.quantity > 1
                                ? updateCartItemMutation.mutate({
                                    id: item.id,
                                    quantity: item.quantity - 1,
                                })
                                : removeCartItemMutation.mutate(item.id)
                        }
                        className="flex items-center justify-center w-full h-7 hover:bg-foreground/5 transition-colors"
                        aria-label="Decrease quantity"
                    >
                        <Minus className="size-3" strokeWidth={1.5} />
                    </button>
                </div>


                {/* Refresh icon */}
                <button
                    className="mt-2 flex items-center justify-center size-6 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Refresh"
                >
                    <RefreshCw className="size-3.5" strokeWidth={1.5} />
                </button>

            </div>
        </div>
    );
}


export function CartItemInfo({ item }: CartItemCardProps) {
    return (
        <div className="mt-2">

            <p className="text-xs text-muted-foreground">
                {item.variant.product.category}
            </p>

            <div className="flex items-start justify-between gap-2 mt-0.5">
                <p
                    className={cn(
                        "text-sm font-semibold leading-tight"
                    )}
                >
                    {item.variant.product.name}
                </p>

                <p className="text-sm font-semibold whitespace-nowrap">
                    ${item.variant.price}
                </p>
            </div>

        </div>
    );
}
