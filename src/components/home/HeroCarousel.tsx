import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Hero carousel images – large fashion shots for desktop view
const heroImages = [
    {
        id: 1,
        src: "https://images.unsplash.com/photo-15523774196-1ab2a1c593e8?w=600&h=750&fit=crop",
        alt: "Man in white hoodie and beige pants",
    },
    {
        id: 2,
        src: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=750&fit=crop",
        alt: "Man in black graphic t-shirt",
    },
    {
        id: 3,
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop",
        alt: "Fashion model in casual wear",
    },
    {
        id: 4,
        src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=750&fit=crop",
        alt: "Fashion model in formal wear",
    },
];

export default function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Show 2 images at a time on desktop
    const maxIndex = Math.max(0, heroImages.length - 2);

    const prev = () => {
        setCurrentIndex((i) => (i <= 0 ? maxIndex : i - 1));
    };

    const next = () => {
        setCurrentIndex((i) => (i >= maxIndex ? 0 : i + 1));
    };

    const visibleImages = heroImages.slice(currentIndex, currentIndex + 2);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                {visibleImages.map((img) => (
                    <div
                        key={img.id}
                        className="flex-1 aspect-[3/4] overflow-hidden rounded-sm bg-white"
                    >
                        <img
                            src={img.src}
                            alt={img.alt}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>

            {/* Navigation arrows */}
            <div className="flex gap-2">
                <button
                    onClick={prev}
                    className="flex items-center justify-center size-10 border border-foreground/20 rounded-sm hover:bg-foreground/5 transition-colors"
                    aria-label="Previous"
                >
                    <ChevronLeft className="size-4" strokeWidth={1.5} />
                </button>

                <button
                    onClick={next}
                    className="flex items-center justify-center size-10 border border-foreground/20 rounded-sm hover:bg-foreground/5 transition-colors"
                    aria-label="Next"
                >
                    <ChevronRight className="size-4" strokeWidth={1.5} />
                </button>
            </div>
        </div>
    );
}