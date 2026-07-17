import Navbar from "@/components/Navbar";
import CategoryTabs from "@/components/CategoryTabs";
import CategoryGrid from "@/components/CategoryGrid";
import CityExplorer from "@/components/CityExplorer";
import FreshRecommendations from "@/components/FreshRecommendations";
import Footer from "@/components/Footer";
// import BannerSection from "@/components/BannerSection";

export default function Home() {
    return (
        <>
            <Navbar />
            <CategoryTabs />
            <main className="flex-1 bg-white">
                <CategoryGrid />
                <CityExplorer />
                <FreshRecommendations />
                {/* <BannerSection /> */}
            </main>
            <Footer />
        </>
    );
}
