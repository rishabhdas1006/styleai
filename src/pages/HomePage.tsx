import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import NewThisWeek from "@/components/home/NewThisWeek";
import CollectionsSection from "@/components/home/CollectionsSection";
import FashionApproach from "@/components/home/FashionApproach";
import Footer from "@/components/home/Footer";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white text-black">
            <div className="relative min-h-[100svh]">
                <HeroSection />
                <Navbar />
            </div>

            <NewThisWeek />
            <CollectionsSection />
            <FashionApproach />
            <Footer />
        </div>
    );
}
