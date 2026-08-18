import { Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { ProductVariant } from "@/types";

export interface EditedVariant {
    price: string;
    stock: string;
}

interface ExistingVariantsTableProps {
    variants: ProductVariant[];
    editedVariants: Record<string, EditedVariant>;
    updatingVariantId: string | null;
    deletingVariantId: string | null;
    onFieldChange: (
        variantId: string,
        field: keyof EditedVariant,
        value: string
    ) => void;
    onUpdate: (variantId: string) => void;
    onDelete: (variantId: string) => void;
    disabled?: boolean;
}

export default function ExistingVariantsTable({
    variants,
    editedVariants,
    updatingVariantId,
    deletingVariantId,
    onFieldChange,
    onUpdate,
    onDelete,
    disabled = false,
}: ExistingVariantsTableProps) {
    if (variants.length === 0) {
        return null;
    }

    return (
        <div className="mb-10">
            <h2 className="font-display text-lg font-semibold text-black mb-3">
                Existing Variants ({variants.length})
            </h2>

            <div className="border rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left px-3 py-2 font-medium">
                                    Size
                                </th>

                                <th className="text-left px-3 py-2 font-medium">
                                    Color
                                </th>

                                <th className="text-left px-3 py-2 font-medium">
                                    SKU
                                </th>

                                <th className="text-left px-3 py-2 font-medium min-w-[120px]">
                                    Price
                                </th>

                                <th className="text-left px-3 py-2 font-medium min-w-[120px]">
                                    Stock
                                </th>

                                <th className="text-right px-3 py-2 font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {variants.map((variant) => {
                                const edited =
                                    editedVariants[
                                    variant.id
                                    ];

                                const isUpdating =
                                    updatingVariantId ===
                                    variant.id;

                                const isDeleting =
                                    deletingVariantId ===
                                    variant.id;

                                const isBusy =
                                    disabled ||
                                    isUpdating ||
                                    isDeleting;

                                return (
                                    <tr
                                        key={variant.id}
                                        className="border-t"
                                    >
                                        <td className="px-3 py-3 font-medium">
                                            {variant.size}
                                        </td>

                                        <td className="px-3 py-3">
                                            <span className="capitalize">
                                                {variant.color}
                                            </span>
                                        </td>

                                        <td className="px-3 py-3 text-muted-foreground">
                                            {variant.sku}
                                        </td>

                                        <td className="px-3 py-3">
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={
                                                    edited?.price ??
                                                    ""
                                                }
                                                disabled={
                                                    isBusy
                                                }
                                                onChange={(e) =>
                                                    onFieldChange(
                                                        variant.id,
                                                        "price",
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                className="w-28"
                                            />
                                        </td>

                                        <td className="px-3 py-3">
                                            <Input
                                                type="number"
                                                min="0"
                                                value={
                                                    edited?.stock ??
                                                    ""
                                                }
                                                disabled={
                                                    isBusy
                                                }
                                                onChange={(e) =>
                                                    onFieldChange(
                                                        variant.id,
                                                        "stock",
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                className="w-24"
                                            />
                                        </td>

                                        <td className="px-3 py-3">
                                            <div className="flex justify-end items-center gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={
                                                        isBusy
                                                    }
                                                    onClick={() =>
                                                        onUpdate(
                                                            variant.id
                                                        )
                                                    }
                                                >
                                                    <Save className="size-4 mr-1" />

                                                    {isUpdating
                                                        ? "Saving..."
                                                        : "Save"}
                                                </Button>

                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    disabled={
                                                        isBusy
                                                    }
                                                    onClick={() =>
                                                        onDelete(
                                                            variant.id
                                                        )
                                                    }
                                                    className="text-muted-foreground hover:text-red-500"
                                                    aria-label="Delete variant"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}