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
import OrdersPage from "./Pages/OrdersPage";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import BackendTest from "./BackendTest";
import LoginPage from "./Pages/LoginPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import SignupPage from "./Pages/SignupPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import SearchResultsPage from "./Pages/SearchResultsPage";

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
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="category/:categoryName" element={<CategoryPage />} />
              <Route path="search" element={<SearchResultsPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route
                path="reset-password/:token"
                element={<ResetPasswordPage />}
              />
              <Route path="signup" element={<SignupPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
