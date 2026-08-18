import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useCheckoutMutation } from "@/api/orders";

const SHIPPING_COST = 10;

interface OrderSummaryProps {
    total: number;
}

export default function OrderSummary({ total }: OrderSummaryProps) {
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const checkoutMutation = useCheckoutMutation();

    const grandTotal = total + SHIPPING_COST;

    const handleCheckout = async () => {
        try {
            await checkoutMutation.mutateAsync();

            // TODO: navigate to order confirmation

        } catch {
            // TODO: show error toast
        }
    };


    return (
        <div className="bg-white rounded-sm p-6 md:p-8">

            <h2 className="font-display text-lg font-bold tracking-tight mb-5">
                ORDER SUMMARY
            </h2>


            <div className="space-y-3">

                <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">
                        Subtotal
                    </span>

                    <span>
                        ${total}
                    </span>
                </div>


                <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">
                        Shipping
                    </span>

                    <span>
                        ${SHIPPING_COST}
                    </span>
                </div>

            </div>


            <div className="flex items-center justify-between mt-5 pt-4 border-t border-foreground/10">

                <span className="font-display text-base font-bold">
                    TOTAL{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                        (TAX INCL.)
                    </span>
                </span>

                <span className="font-display text-base font-bold">
                    ${grandTotal}
                </span>

            </div>


            <label className="flex items-start gap-3 mt-6 cursor-pointer">

                <Checkbox
                    checked={agreedToTerms}
                    onCheckedChange={(checked) =>
                        setAgreedToTerms(checked === true)
                    }
                    className="mt-0.5"
                />

                <span className="text-xs leading-relaxed">
                    I agree to the Terms and Conditions
                </span>

            </label>


            <button
                disabled={!agreedToTerms || checkoutMutation.isPending}
                onClick={handleCheckout}
                className="mt-5 w-full h-11 rounded-sm bg-foreground/15 text-sm font-bold uppercase tracking-wider text-foreground hover:bg-foreground/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {checkoutMutation.isPending ? "Processing..." : "Continue"}
            </button>

        </div>
    );
}
