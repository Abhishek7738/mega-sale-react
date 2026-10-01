import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

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
import TrendingProductsSection from "./components/TrendingProductsSection";
import NewArrivalsSection from "./components/NewArrivalsSection";
import FeaturedBlogSection from "./components/FeaturedBlogSection";
import FooterSection from "./components/FooterSection";
import BackToTopButton from "./components/BackToTopButton";

import CategoryPage from "./Pages/CategoryPage";
import CartPage from "./Pages/CartPage";
import CheckoutPage from "./Pages/CheckoutPage";

import { CartProvider } from "./context/CartContext";
import BackendTest from "./BackendTest";
import LoginPage from "./Pages/LoginPage";

function MainLayout() {
  return (
    <>
      <TopBar />
      <Navbar />
      <Outlet />
      <FooterSection />
      <BackToTopButton />
    </>
  );
}

function HomePage() {
  return (
    <div>
      <Hero />

      <PromoSection />

      <Categories />

      <ProductSection />

      <OfferSection />

      <TopSellingSection />

      <BannerSection />

      <BreakfastDairySection />

      <FreshFruitsSection />

      <PromoBannersSection />

      <OrganicVegetablesSection />

      <BestSellersSection />

      <DeliveryBannersSection />

      <TrendingProductsSection />

      <NewArrivalsSection />

      <FeaturedBlogSection />

      <BackendTest />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route  element={<MainLayout />}>
            <Route index element={<HomePage />} />

            <Route path="category/:categoryName" element={<CategoryPage />} />

            <Route path="cart" element={<CartPage />} />

            <Route path="checkout" element={<CheckoutPage />} />

            <Route path="login" element={<LoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
