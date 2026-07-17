import CategoryTabs from "@/components/layout/CategoryTabs";
import CategoryGrid from "@/components/home-ui/CategoryGrid";
import CityExplorer from "@/components/home-ui/CityExplorer";
import FreshRecommendations from "@/components/home-ui/FreshRecommendations";
import { listings } from "@/lib/listings";
import HorizontalList from "@/components/home-ui/HorizontalList";
import BannerSection from "@/components/home-ui/BannerSection";

export default function Home() {
    return (
        <>
            <CategoryTabs />
            <main className="flex-1 bg-white">
                <CategoryGrid />
                <CityExplorer />
                <FreshRecommendations />
                <BannerSection />
                <HorizontalList className="bg-green-50 my-8 " title="Laptop & Desktop for Sale" description="Find the best deals on laptops and desktops for sale in your area" data={listings?.slice(5)} />
                <HorizontalList className="bg-white my-8 " title="Mobile & Tablets for Sale" description="Find the best deals on mobile and tablets for sale in your area" data={listings?.slice(5)} />
                <HorizontalList className="bg-violet-50 my-8 " title="TV & Audio for Sale" description="Find the best deals on TVs and audio for sale in your area" data={listings?.slice(5)} />
                <HorizontalList className="bg-white my-8 " title="Home & Kitchen for Sale" description="Find the best deals on home and kitchen for sale in your area" data={listings?.slice(5)} />
            </main>
        </>
    );
}
