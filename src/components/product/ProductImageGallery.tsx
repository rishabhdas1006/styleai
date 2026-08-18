import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
}

export default function ProductImageGallery({
    images,
    productName,
}: ProductImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <>
            {/* Desktop layout: large image left + vertical thumbnails right */}
            <div className="hidden md:flex gap-4">
                {/* Main image */}
                <div className="flex-1 aspect-[4/5] bg-white rounded-sm overflow-hidden">
                    <img
                        src={images[selectedIndex]}
                        alt={productName}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Vertical thumbnails */}
                <div className="flex flex-col gap-3 w-20">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedIndex(i)}
                            className={cn(
                                "aspect-[4/5] overflow-hidden rounded-sm bg-white border-2 transition-colors",
                                i === selectedIndex
                                    ? "border-foreground"
                                    : "border-transparent hover:border-foreground/20"
                            )}
                        >
                            <img
                                src={img}
                                alt={`${productName} view ${i + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile layout: full-width main image + horizontal thumbnails */}
            <div className="md:hidden">
                {/* Main image */}
                <div className="aspect-[3/4] bg-white rounded-sm overflow-hidden -mx-6">
                    <img
                        src={images[selectedIndex]}
                        alt={productName}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Horizontal thumbnail strip */}
                <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedIndex(i)}
                            className={cn(
                                "flex-shrink-0 w-16 aspect-square overflow-hidden rounded-sm bg-white border-2 transition-colors",
                                i === selectedIndex
                                    ? "border-foreground"
                                    : "border-transparent hover:border-foreground/20"
                            )}
                        >
                            <img
                                src={img}
                                alt={`${productName} view ${i + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}