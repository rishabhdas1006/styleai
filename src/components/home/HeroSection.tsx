import { Link } from "react-router-dom";

const heroImages = [
    {
        id: 1,
        src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85",
        alt: "Model in a minimal white look",
    },
    {
        id: 2,
        src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85",
        alt: "Model in neutral tailored clothing",
    },
    {
        id: 3,
        src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
        alt: "Editorial fashion model in black",
    },
];

export default function HeroSection() {
    return (
        <section className="relative min-h-[100svh] overflow-hidden bg-black">
            <div className="absolute inset-0">
                <div className="grid h-full grid-cols-1 md:grid-cols-3">
                    {heroImages.map((img) => (
                        <div
                            key={img.id}
                            className="relative min-h-[34svh] overflow-hidden md:min-h-[100svh]"
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 bg-black/25" />
            </div>

            <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-end px-5 pb-14 text-center text-white md:pb-16">
                <p className="mb-4 text-xs uppercase">Summer editorial 2026</p>
                <h1 className="m-0 max-w-5xl text-[clamp(3.75rem,13vw,10.5rem)] font-normal leading-[0.82] text-white">
                    NEW ORDER
                </h1>
                <Link
                    to="/products"
                    className="mt-8 inline-flex h-11 items-center justify-center border border-white px-8 text-xs uppercase text-white transition-colors hover:bg-white hover:text-black"
                >
                    Shop now
                </Link>
                <div className="mt-10 grid w-full max-w-5xl grid-cols-3 text-left text-[10px] uppercase text-white/80 md:text-xs">
                    <span>01 / Woman</span>
                    <span className="text-center">02 / Man</span>
                    <span className="text-right">03 / Essentials</span>
                </div>
            </div>
        </section>
    );
}
