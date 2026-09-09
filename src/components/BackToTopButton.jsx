import { useEffect, useState } from "react";

function BackToTopButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!showButton) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className="
        fixed
        bottom-5
        right-5
        z-50
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-md
        bg-blue-600
        text-white
        shadow-md
        transition-transform
        duration-300
        hover:-translate-y-1
        hover:bg-blue-700
      "
    >
      <i className="fa-solid fa-chevron-up"></i>
    </button>
  );
}

export default BackToTopButton;