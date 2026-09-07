import Navbar from "./components/Navbar";
import TopBar from "./components/TopBar";
import Hero from "./components/Hero";
import PromoSection from "./components/PromoSection";
import Categories from "./components/Categories";
import ProductSection from "./components/ProductSection";
import OfferSection from "./components/OfferSection";
import TopSellingSection from "./components/TopSellingSection";
import BannerSection from "./components/BannerSection";
import BreakfastDairySection from "./components/BreakfastDairySection";
import FreshFruitsSection from "./components/FreshFruitsSection";
import PromoBannersSection from "./components/PromoBannersSection";
import OrganicVegetablesSection from "./components/OrganicVegetablesSection";
import BestSellersSection from "./components/BestSellersSection";
import DeliveryBannersSection from "./components/DeliveryBannersSection";

function App() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <Hero />
      <PromoSection />
      <Categories />
      <ProductSection />
      <OfferSection />
      <TopSellingSection />
      <BannerSection />
      <BreakfastDairySection/>
      <FreshFruitsSection/>
      <PromoBannersSection/>
      <OrganicVegetablesSection/>
      <BestSellersSection/>
      <DeliveryBannersSection />
    </div>
  );
}

export default App;
