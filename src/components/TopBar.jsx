function TopBar() {
  return (
    <div className="w-full h-[35px] bg-[#0666d6] text-white overflow-hidden">
      <div className="flex w-max animate-[marquee_30s_linear_infinite]">
        <span className="whitespace-nowrap px-[60px] py-[8px]">
          Welcome to Megsale! Wrap new offers/gift every single day on Weekends.
          New Coupon Code: FAST50
        </span>
        <span className="whitespace-nowrap px-[60px] py-[8px]">
          Something you love is now on sale — Buy Now!
        </span>

        <span className="whitespace-nowrap px-[60px] py-[8px]">
          Your must-have item is calling — Buy Now!
        </span>
      </div>
    </div>
  );
}
export default TopBar;
