function TopBar() {
  return (
    <div className="w-full h-9 bg-blue-600 text-white overflow-hidden">
      <div className="flex w-max items-center animate-[marquee_30s_linear_infinite]">
        <span className="whitespace-nowrap px-8 sm:px-12 py-2 text-xs sm:text-sm  font-medium leading-none">
          🎉 Welcome to Megsale!
        </span>
        <span className="whitespace-nowrap px-8 sm:px-12 py-2 text-xs sm:text-sm  font-medium leading-none">
          🔥 New Coupon Code: FAST50
        </span>

        <span className="whitespace-nowrap px-8 sm:px-12 py-2 text-xs sm:text-sm  font-medium leading-none">
          🛍️ Something you love is now on sale — Buy Now!
        </span>
      </div>
    </div>
  );
}
export default TopBar;
