import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";

// const routeBanner = [ROUTE_PATH.PRODUCT, ROUTE_PATH.SERVICE, ROUTE_PATH.SHOP];

function ScrollToTopButton() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    visible && (
      <Button
        onClick={scrollToTop}
        variant="default"
        size="icon"
        className="cursor-pointer fixed bottom-8 right-8 z-50 border border-custom-blue bg-white text-custom-blue shadow-lg hover:bg-custom-hover-blue2 transition"
        aria-label="Lên đầu trang"
      >
        <span className="text-2xl">↑</span>
      </Button>
    )
  );
}

function MainLayout({ children }) {
  return (
    <div>
      <Header />
      <div className="mx-auto pt-20">{children}</div>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
}

export default MainLayout;
