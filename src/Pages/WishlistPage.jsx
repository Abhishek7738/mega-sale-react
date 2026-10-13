import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function WishlistPage() {
  const { wishlistItems, loading, error, removeFromWishlist, fetchWishlist } =
    useWishlist();

  const { addToCart } = useCart();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const handleRemove = async (productId) => {
    const result = await removeFromWishlist(productId);

    if (!result.success) {
      alert(result.message);
    }
  };

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      id: product._id || product.id,
    });

    navigate("/cart");
  };

  if (authLoading || loading) {
    return (
      <main className="wishlist-page flex min-h-[50vh] items-center justify-center bg-orange-50/40 px-4 py-10">
        <div className="text-center">
          <i className="fa-regular fa-heart animate-pulse text-3xl text-orange-500" />
          <p className="mt-3 text-sm text-gray-500">Loading your wishlist...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="wishlist-page flex min-h-[50vh] flex-col items-center justify-center bg-orange-50/40 px-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-100 bg-white shadow-sm">
          <i className="fa-regular fa-heart text-2xl text-orange-500" />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900">My Wishlist</h1>

        <p className="mt-2 text-sm text-gray-500">
          Please log in to view your saved products.
        </p>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="wishlist-cart-button mt-5 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-100 hover:bg-orange-600"
        >
          Login to Continue
        </button>
      </main>
    );
  }

  if (error) {
    return (
      <main className="wishlist-page min-h-[50vh] bg-orange-50/40 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-orange-100 bg-white/90 p-6 text-center shadow-sm">
          <i className="fa-solid fa-circle-exclamation text-3xl text-orange-500" />

          <p className="mt-3 text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={fetchWishlist}
            className="wishlist-cart-button mt-4 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="wishlist-page min-h-[60vh] bg-gradient-to-b from-orange-50/60 via-white to-orange-50/30">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Compact Glassmorphism Toolbar */}
        <section className="wishlist-header mb-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/90 bg-white/75 px-4 py-4 shadow-[0_8px_30px_rgba(249,115,22,0.07)] backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 text-orange-500 shadow-sm">
              <i className="fa-solid fa-heart text-lg" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                My Wishlist
              </h1>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Your favourite products, all in one place.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-xl border border-orange-100 bg-white/85 px-3.5 py-2.5 shadow-sm">
              <i className="fa-solid fa-bookmark text-base text-orange-500" />

              <div>
                <p className="text-lg font-bold leading-5 text-gray-900">
                  {wishlistItems.length}
                </p>

                <p className="mt-1 whitespace-nowrap text-[11px] text-gray-500">
                  Saved products
                </p>
              </div>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white/85 px-3 py-2.5 text-xs font-semibold text-orange-700 shadow-sm transition-colors duration-200 hover:border-orange-300 hover:bg-orange-50 sm:px-4 sm:text-sm"
            >
              <i className="fa-solid fa-arrow-left text-[11px]" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </section>

        {/* Section Heading */}
        <div className="wishlist-toolbar mb-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              Your saved items
            </h2>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Keep your favourites close and shop whenever you're ready.
            </p>
          </div>
        </div>

        {/* Empty Wishlist */}
        {wishlistItems.length === 0 ? (
          <section className="wishlist-empty rounded-2xl border border-orange-100/80 bg-white/80 px-5 py-14 text-center shadow-sm backdrop-blur-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50/80">
              <i className="fa-regular fa-heart text-3xl text-orange-400" />
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Save your favourite products and find them here whenever you're
              ready to shop.
            </p>

            <Link
              to="/"
              className="wishlist-cart-button mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-100 hover:bg-orange-600"
            >
              Explore Products
              <i className="fa-solid fa-arrow-right text-xs" />
            </Link>
          </section>
        ) : (
          /* Compact Responsive Product Grid */
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {wishlistItems.map((item, index) => {
              const product = item.product || item;
              const productId = product._id || product.id;

              if (!productId) return null;

              const hasDiscount =
                Number(product.oldPrice) > Number(product.price) &&
                Number(product.oldPrice) > 0;

              const discount = hasDiscount
                ? Math.round(
                    ((Number(product.oldPrice) - Number(product.price)) /
                      Number(product.oldPrice)) *
                      100,
                  )
                : 0;

              return (
                <article
                  key={productId}
                  style={{
                    animationDelay: `${Math.min(index, 8) * 50}ms`,
                  }}
                  className="wishlist-card group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-orange-100/70 bg-white shadow-sm"
                >
                  {/* Product Image */}
                  <div className="relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-b from-white to-orange-50/60 p-3 sm:h-40 sm:p-4">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name || "Product"}
                        loading="lazy"
                        className="wishlist-image h-full w-full object-contain"
                      />
                    ) : (
                      <i className="fa-regular fa-image text-3xl text-gray-300" />
                    )}

                    {/* Discount Badge */}
                    {hasDiscount && (
                      <span className="absolute bottom-2 left-2 rounded-md border border-orange-100 bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-700 sm:bottom-3 sm:left-3">
                        {discount}% OFF
                      </span>
                    )}

                    {/* Remove from Wishlist */}
                    <button
                      type="button"
                      onClick={() => handleRemove(productId)}
                      aria-label={`Remove ${product.name || "product"} from wishlist`}
                      title="Remove from Wishlist"
                      className="wishlist-heart absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-orange-100 bg-white/95 text-orange-500 shadow-sm sm:right-3 sm:top-3"
                    >
                      <i className="fa-solid fa-heart text-sm" />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col p-3 sm:p-3.5">
                    <h3
                      className="min-h-10 text-xs font-bold leading-5 text-gray-800 transition-colors duration-200 group-hover:text-orange-700 sm:text-sm"
                      title={product.name}
                    >
                      <span className="line-clamp-2">{product.name}</span>
                    </h3>

                    {product.weight && (
                      <p className="mt-1 truncate text-[11px] text-gray-500 sm:text-xs">
                        {product.weight}
                      </p>
                    )}

                    {/* Product Price */}
                    <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
                      <span className="text-sm font-extrabold text-gray-900 sm:text-base">
                        ₹{product.price}
                      </span>

                      {hasDiscount && (
                        <span className="text-[11px] text-gray-400 line-through">
                          ₹{product.oldPrice}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-orange-600 sm:text-[11px]">
                      <i className="fa-solid fa-circle-check" />
                      <span>Saved to wishlist</span>
                    </div>

                    {/* Add to Cart */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="wishlist-cart-button mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 px-2 py-2.5 text-xs font-bold text-white shadow-sm shadow-orange-100 hover:from-orange-500 hover:to-orange-600 sm:text-sm"
                    >
                      <i className="fa-solid fa-cart-shopping text-[11px]" />
                      Add to Cart
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Account Wishlist Note */}
        {wishlistItems.length > 0 && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-orange-100 bg-white/75 p-4 shadow-sm backdrop-blur-sm">
            <i className="fa-solid fa-shield-heart mt-0.5 text-lg text-orange-500" />

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Your favourites stay saved
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Your wishlist belongs to your account. Placing an order won't
                automatically remove saved products.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default WishlistPage;
