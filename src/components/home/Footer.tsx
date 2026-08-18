import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-white text-black">
            <div className="px-4 py-12 md:px-8 md:py-16">
                <div className="grid gap-10 border-b border-black/10 pb-12 md:grid-cols-[1fr_1fr_2fr] md:gap-16">
                    <div>
                        <h4 className="mb-4 text-[11px] uppercase text-black/40">
                            Help
                        </h4>

                        <nav className="flex flex-col items-start gap-2">
                            <Link
                                to="/products"
                                className="text-sm uppercase text-black/70 transition-colors hover:text-black"
                            >
                                Collection
                            </Link>

                            <Link
                                to="/about"
                                className="text-sm uppercase text-black/70 transition-colors hover:text-black"
                            >
                                About
                            </Link>

                            <Link
                                to="/contact"
                                className="text-sm uppercase text-black/70 transition-colors hover:text-black"
                            >
                                Contact
                            </Link>
                        </nav>
                    </div>

                    <div>
                        <h4 className="mb-4 text-[11px] uppercase text-black/40">
                            Social
                        </h4>

                        <div className="flex flex-col items-start gap-2">
                            <a href="#" className="text-sm uppercase text-black/70 hover:text-black">
                                Instagram
                            </a>
                            <a href="#" className="text-sm uppercase text-black/70 hover:text-black">
                                Pinterest
                            </a>
                            <a href="#" className="text-sm uppercase text-black/70 hover:text-black">
                                Newsletter
                            </a>
                        </div>
                    </div>

                    <div className="md:text-right">
                        <div className="text-5xl font-semibold leading-none md:text-8xl">
                            STYLEAI
                        </div>

                        <p className="mt-4 text-sm text-black/50">
                            Minimal fashion intelligence for everyday dressing.
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 pb-6 md:px-8">
                <p className="text-center text-xs uppercase text-black/40">
                    Copyright {new Date().getFullYear()}
                </p>
            </div>
        </footer>
    );
}
