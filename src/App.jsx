import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

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
import TrackOrderPage from "./Pages/TrackOrderPage";
import ThankYouPage from "./Pages/ThankYouPage";
import ProfilePage from "./Pages/ProfilePage";
import LoginPage from "./Pages/LoginPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import SignupPage from "./Pages/SignupPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import SearchResultsPage from "./Pages/SearchResultsPage";
import WishlistPage from "./Pages/WishlistPage";
import ContactPage from "./Pages/ContactPage";

import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";

import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminLayout from "./Pages/Admin/AdminLayout";
import AdminProducts from "./Pages/Admin/AdminProducts";
import AdminPremium from "./Pages/Admin/AdminPremium";
import AdminNewLaunch from "./Pages/Admin/AdminNewLaunch";
import AdminOrders from "./Pages/Admin/AdminOrders";
import Premium from "./Pages/Premium";
import NewLaunch from "./Pages/NewLaunch";

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

      <ProductSection category="vegetables & fruits" />

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
    </div>
  );
}

function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center">Checking admin access...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <AdminLayout />;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <Routes>
              {/* Admin routes: separate from customer layout */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="premium" element={<AdminPremium />} />
                <Route path="new-launch" element={<AdminNewLaunch />} />
                <Route path="orders" element={<AdminOrders />} />
              </Route>

              {/* Existing customer website routes */}
              <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />

                <Route
                  path="category/:categoryName"
                  element={<CategoryPage />}
                />
                <Route path="premium" element={<Premium />} />
                <Route path="new-launch" element={<NewLaunch />} />

                <Route path="search" element={<SearchResultsPage />} />

                <Route path="cart" element={<CartPage />} />

                <Route path="checkout" element={<CheckoutPage />} />

                <Route path="orders" element={<OrdersPage />} />

                <Route path="wishlist" element={<WishlistPage />} />

                <Route path="contact" element={<ContactPage />} />

                <Route
                  path="track-order/:orderId"
                  element={<TrackOrderPage />}
                />

                <Route path="thank-you" element={<ThankYouPage />} />

                <Route path="profile" element={<ProfilePage />} />

                <Route path="login" element={<LoginPage />} />

                <Route
                  path="forgot-password"
                  element={<ForgotPasswordPage />}
                />

                <Route
                  path="reset-password/:token"
                  element={<ResetPasswordPage />}
                />

                <Route path="signup" element={<SignupPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
