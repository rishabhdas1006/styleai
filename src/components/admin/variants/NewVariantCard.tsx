import { Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";

import VariantImagePicker from "./VariantImagePicker";

export interface VariantForm {
    size: string;
    color: string;
    price: string;
    stock: string;
    images: File[];
}

interface NewVariantCardProps {
    variant: VariantForm;
    index: number;
    canRemove: boolean;
    onChange: (
        index: number,
        field: keyof VariantForm,
        value: string
    ) => void;
    onImagesChange: (
        index: number,
        images: File[]
    ) => void;
    onRemove: (index: number) => void;
    disabled?: boolean;
}

export default function NewVariantCard({
    variant,
    index,
    canRemove,
    onChange,
    onImagesChange,
    onRemove,
    disabled = false,
}: NewVariantCardProps) {
    return (
        <div className="border rounded-md p-4 space-y-5 relative">
            {canRemove && (
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    disabled={disabled}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
                    aria-label="Remove variant"
                >
                    <Trash2 className="size-4" />
                </button>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pr-6">
                {/* Size */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                        Size{" "}
                        <span className="text-red-500">*</span>
                    </label>

                    <Input
                        placeholder="e.g. M, L, XL"
                        value={variant.size}
                        disabled={disabled}
                        onChange={(e) =>
                            onChange(
                                index,
                                "size",
                                e.target.value
                            )
                        }
                    />
                </div>

                {/* Color */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                        Color{" "}
                        <span className="text-red-500">*</span>
                    </label>

                    <Input
                        placeholder="e.g. black, red"
                        value={variant.color}
                        disabled={disabled}
                        onChange={(e) =>
                            onChange(
                                index,
                                "color",
                                e.target.value
                            )
                        }
                    />
                </div>

                {/* Price */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                        Price{" "}
                        <span className="text-red-500">*</span>
                    </label>

                    <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="999"
                        value={variant.price}
                        disabled={disabled}
                        onChange={(e) =>
                            onChange(
                                index,
                                "price",
                                e.target.value
                            )
                        }
                    />
                </div>

                {/* Stock */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                        Stock{" "}
                        <span className="text-red-500">*</span>
                    </label>

                    <Input
                        type="number"
                        min="0"
                        placeholder="50"
                        value={variant.stock}
                        disabled={disabled}
                        onChange={(e) =>
                            onChange(
                                index,
                                "stock",
                                e.target.value
                            )
                        }
                    />
                </div>
            </div>

            <VariantImagePicker
                images={variant.images}
                onChange={(images) =>
                    onImagesChange(index, images)
                }
                disabled={disabled}
            />
        </div>
    );
}