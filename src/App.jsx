import Navbar from "./components/Navbar";
import TopBar from "./components/TopBar";
import Hero from "./components/Hero";
import PromoSection from "./components/PromoSection";
import Categories from "./components/Categories";
import ProductSection from "./components/ProductSection";
import OfferSection from "./components/OfferSection";
import TopSellingSection from "./components/TopSellingSection";
import BannerSection from "./components/BannerSection";
function App() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <Hero />
      <PromoSection />
      <Categories />
      <ProductSection/>
      <OfferSection/>
      <TopSellingSection />
      <BannerSection />
     
    </div>
  );
}

export default App;
