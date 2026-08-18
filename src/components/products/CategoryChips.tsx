import { cn } from "@/lib/utils";

const categories = [
    "NEW",
    "SHIRTS",
    "POLO SHIRTS",
    "SHORTS",
    "SUITS",
    "BEST SELLERS",
    "T-SHIRTS",
    "JEANS",
    "JACKETS",
    "COATS",
];

interface CategoryChipsProps {
    activeChip: string;
    onChange: (category: string) => void;
}

export default function CategoryChips({
    activeChip,
    onChange,
}: CategoryChipsProps) {
    return (
        <div className="flex gap-5 overflow-x-auto pb-1">
            {categories.map((cat) => (
                <button
                    key={cat}
                    type="button"
                    onClick={() => onChange(cat)}
                    className={cn(
                        "flex-shrink-0 text-xs uppercase transition-colors",
                        activeChip === cat
                            ? "text-black underline underline-offset-4"
                            : "text-black/40 hover:text-black"
                    )}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
