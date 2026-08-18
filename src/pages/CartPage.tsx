import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetCartQuery } from "@/api/cart";
import { useAuth } from "@/lib/authStore";
import CartItemCard, {
    CartItemInfo,
} from "@/components/cart/CartItemCard";
import OrderSummary from "@/components/cart/OrderSummary";

type Tab = "bag" | "favourites";

export default function CartPage() {
    const [activeTab, setActiveTab] = useState<Tab>("bag");
    const { isAuthenticated } = useAuth();
    const { data: cart, isLoading } = useGetCartQuery(isAuthenticated);

    const items = cart?.items ?? [];

    return (
        <div className="px-6 md:px-10 pb-10">
            {/* Tabs */}
            <div className="flex items-center gap-6 pt-4 md:pt-8 pb-6">
                <button
                    onClick={() => setActiveTab("bag")}
                    className={cn(
                        "font-display text-xl md:text-2xl font-bold tracking-tight transition-colors",
                        activeTab === "bag"
                            ? "text-foreground"
                            : "text-foreground/30"
                    )}
                >
                    SHOPPING BAG
                </button>

                <button
                    onClick={() => setActiveTab("favourites")}
                    className={cn(
                        "flex items-center gap-2 text-sm tracking-wider transition-colors",
                        activeTab === "favourites"
                            ? "text-foreground font-medium"
                            : "text-foreground/40"
                    )}
                >
                    <Heart className="size-3.5" strokeWidth={1.5} />
                    FAVOURITES
                </button>
            </div>

            {activeTab === "bag" ? (
                isLoading ? (
                    <div className="py-16 text-center">
                        <p className="text-muted-foreground">Loading cart...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-muted-foreground">
                            Your shopping bag is empty.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        {/* Cart items */}
                        <div className="flex-1 min-w-0">
                            {/* Desktop: items side by side */}
                            <div className="hidden md:grid md:grid-cols-2 gap-6">
                                {items.map((item) => (
                                    <div key={item.id}>
                                        <CartItemCard item={item} />
                                        <CartItemInfo item={item} />
                                    </div>
                                ))}
                            </div>

                            {/* Mobile: items stacked */}
                            <div className="md:hidden space-y-6">
                                {items.map((item) => (
                                    <div key={item.id}>
                                        <CartItemCard item={item} />
                                        <CartItemInfo item={item} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order summary — desktop right, mobile below */}
                        <div className="lg:w-80 flex-shrink-0">
                            <div className="lg:sticky lg:top-6">
                                <OrderSummary total={cart?.total ?? 0} />
                            </div>
                        </div>
                    </div>
                )
            ) : (
                <div className="py-16 text-center">
                    <p className="text-muted-foreground">
                        No favourites yet.
                    </p>
                </div>
            )}
        </div>
    );
}
