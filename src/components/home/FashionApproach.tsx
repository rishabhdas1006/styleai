const approachImages = [
    {
        src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=85",
        alt: "Model wearing minimal black fashion",
    },
    {
        src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=700&q=85",
        alt: "Minimal wardrobe detail",
    },
    {
        src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",
        alt: "Cotton shirt detail",
    },
    {
        src: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=700&q=85",
        alt: "Tailoring detail",
    },
];

export default function FashionApproach() {
    return (
        <section className="border-y border-black/10 bg-[#f7f7f5] py-16 md:py-24">
            <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
                <p className="mb-5 text-xs uppercase text-black/50">Style notes</p>
                <h2 className="m-0 text-3xl font-normal uppercase leading-tight text-black md:text-5xl">
                    Reduced shapes, deliberate materials, quiet confidence
                </h2>

                <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-black/60">
                    A restrained wardrobe built around movement, proportion, and
                    everyday ease. The pieces stay simple so the silhouette can do
                    the talking.
                </p>
            </div>

            <div className="mt-12 overflow-hidden">
                <div className="flex gap-3 overflow-x-auto px-4 pb-4 md:px-8">
                    {approachImages.map((img, i) => (
                        <div
                            key={i}
                            className="aspect-[3/4] w-56 flex-shrink-0 overflow-hidden bg-white md:w-72"
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
