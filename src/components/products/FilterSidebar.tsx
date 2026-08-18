import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import type { ProductFilters } from "@/pages/ProductsPage";

const sizes = ["XS", "S", "M", "L", "XL", "2X"];

const genders = [
    { label: "Men", value: "men" },
    { label: "Women", value: "women" },
    { label: "Kids", value: "kids" },
    { label: "Unisex", value: "unisex" },
];

const colors = [
    { name: "Black", value: "black", hex: "#000000" },
    { name: "White", value: "white", hex: "#FFFFFF" },
    { name: "Red", value: "red", hex: "#EF4444" },
    { name: "Blue", value: "blue", hex: "#3B82F6" },
    { name: "Green", value: "green", hex: "#22C55E" },
    { name: "Yellow", value: "yellow", hex: "#EAB308" },
    { name: "Pink", value: "pink", hex: "#EC4899" },
    { name: "Gray", value: "gray", hex: "#6B7280" },
];

interface FilterSidebarProps {
    filters: ProductFilters;
    onChange: (filters: ProductFilters) => void;
    onReset: () => void;
    onApply: () => void;
}

export default function FilterSidebar({
    filters,
    onChange,
    onReset,
    onApply,
}: FilterSidebarProps) {
    const [openSections, setOpenSections] = useState<
        Record<string, boolean>
    >({
        gender: true,
        size: true,
        colors: true,
        price: true,
        availability: false,
    });

    const toggleSection = (key: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const priceValue: [number, number] = [
        filters.minPrice ?? 0,
        filters.maxPrice ?? 10000,
    ];

    const updateFilters = (next: Partial<ProductFilters>) => {
        onChange({
            ...filters,
            ...next,
        });
    };

    const toggleArrayValue = <T extends string>(values: T[], value: T) =>
        values.includes(value)
            ? values.filter((item) => item !== value)
            : [...values, value];

    return (
        <div className="space-y-7 text-left">
            <FilterGroup
                title="Gender"
                open={openSections.gender}
                onToggle={() => toggleSection("gender")}
            >
                <div className="space-y-3">
                    {genders.map((g) => (
                        <label
                            key={g.value}
                            className="flex cursor-pointer items-center gap-3 text-sm text-black/70"
                        >
                            <Checkbox
                                checked={filters.gender === g.value}
                                onCheckedChange={() =>
                                    updateFilters({
                                        gender:
                                            filters.gender === g.value
                                                ? ""
                                                : g.value,
                                    })
                                }
                            />
                            <span>{g.label}</span>
                        </label>
                    ))}
                </div>
            </FilterGroup>

            <FilterGroup
                title="Size"
                open={openSections.size}
                onToggle={() => toggleSection("size")}
            >
                <div className="grid grid-cols-3 gap-2">
                    {sizes.map((size) => (
                        <button
                            key={size}
                            type="button"
                            onClick={() =>
                                updateFilters({
                                    sizes: toggleArrayValue(
                                        filters.sizes,
                                        size
                                    ),
                                })
                            }
                            className={cn(
                                "flex h-10 items-center justify-center border text-xs uppercase transition-colors",
                                filters.sizes.includes(size)
                                    ? "border-black bg-black text-white"
                                    : "border-black/20 text-black hover:border-black"
                            )}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </FilterGroup>

            <FilterGroup
                title="Color"
                open={openSections.colors}
                onToggle={() => toggleSection("colors")}
            >
                <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                        <button
                            key={color.value}
                            type="button"
                            onClick={() =>
                                updateFilters({
                                    colors: toggleArrayValue(
                                        filters.colors,
                                        color.value
                                    ),
                                })
                            }
                            title={color.name}
                            className={cn(
                                "h-9 border transition-all",
                                filters.colors.includes(color.value)
                                    ? "border-black ring-1 ring-black"
                                    : "border-black/10 hover:border-black/40"
                            )}
                            style={{
                                backgroundColor: color.hex,
                            }}
                        />
                    ))}
                </div>
            </FilterGroup>

            <FilterGroup
                title="Price"
                open={openSections.price}
                onToggle={() => toggleSection("price")}
            >
                <div className="space-y-4">
                    <Slider
                        min={0}
                        max={10000}
                        step={100}
                        value={priceValue}
                        onValueChange={(val) => {
                            const range = Array.isArray(val)
                                ? val
                                : [val, val];

                            updateFilters({
                                minPrice: range[0] ?? 0,
                                maxPrice: range[1] ?? range[0] ?? 10000,
                            });
                        }}
                    />

                    <div className="flex items-center justify-between text-xs uppercase text-black/45">
                        <span>${priceValue[0]}</span>
                        <span>${priceValue[1]}</span>
                    </div>
                </div>
            </FilterGroup>

            <FilterGroup
                title="Availability"
                open={openSections.availability}
                onToggle={() => toggleSection("availability")}
            >
                <div className="space-y-3">
                    <label className="flex cursor-pointer items-center gap-3 text-sm text-black/70">
                        <Checkbox
                            checked={filters.availability.includes("in-stock")}
                            onCheckedChange={() =>
                                updateFilters({
                                    availability: toggleArrayValue(
                                        filters.availability,
                                        "in-stock"
                                    ),
                                })
                            }
                        />
                        <span>In stock</span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 text-sm text-black/70">
                        <Checkbox
                            checked={filters.availability.includes("out-of-stock")}
                            onCheckedChange={() =>
                                updateFilters({
                                    availability: toggleArrayValue(
                                        filters.availability,
                                        "out-of-stock"
                                    ),
                                })
                            }
                        />
                        <span>Out of stock</span>
                    </label>
                </div>
            </FilterGroup>

            <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                    onClick={onApply}
                    className="h-11 rounded-none bg-black text-xs uppercase text-white hover:bg-black/80"
                >
                    Apply
                </Button>

                <Button
                    variant="outline"
                    onClick={() => {
                        onReset();
                        onApply();
                    }}
                    className="h-11 rounded-none border-black/20 text-xs uppercase hover:bg-black hover:text-white"
                >
                    Reset
                </Button>
            </div>
        </div>
    );
}

function FilterGroup({
    children,
    onToggle,
    open,
    title,
}: {
    children: ReactNode;
    onToggle: () => void;
    open: boolean;
    title: string;
}) {
    return (
        <div className="border-b border-black/10 pb-5">
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between"
            >
                <h3 className="m-0 text-xs font-normal uppercase text-black">
                    {title}
                </h3>

                <ChevronUp
                    className={cn(
                        "size-4 text-black/50 transition-transform",
                        !open && "rotate-180"
                    )}
                    strokeWidth={1.4}
                />
            </button>

            {open && <div className="mt-4">{children}</div>}
        </div>
    );
}
