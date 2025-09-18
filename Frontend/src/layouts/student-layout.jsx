import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import PropTypes from "prop-types";

const isBrowser = typeof window !== "undefined";

function ScrollToTopButton() {
  const [visible, setVisible] = React.useState(false);

  const updateVisible = React.useCallback(() => {
    if (!isBrowser) return;
    setVisible(window.scrollY > 200);
  }, []);

  React.useEffect(() => {
    if (!isBrowser) return;

    // Dùng requestAnimationFrame để “mượt” và giảm tần suất setState
    let rafId = null;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateVisible);
    };

    // Khởi tạo trạng thái ban đầu
    updateVisible();

    // passive:true để cuộn mượt hơn
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [updateVisible]);

  const scrollToTop = React.useCallback(() => {
    if (!isBrowser) return;
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      // Fallback nếu browser không hỗ trợ smooth
      window.scrollTo(0, 0);
    }
  }, []);

  if (!visible) return null;

  return (
    <Button
      onClick={scrollToTop}
      variant="default"
      size="icon"
      className="cursor-pointer fixed bottom-8 right-8 z-50 border border-custom-blue bg-white text-custom-blue shadow-lg hover:bg-custom-hover-blue2 transition"
      aria-label="Lên đầu trang"
      type="button"
    >
      <span className="text-2xl" aria-hidden>↑</span>
    </Button>
  );
}

function MainLayout(props) {
  // Phòng thủ: tránh destructuring từ null/undefined
  const { children } = props ?? {};

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full flex-1 pt-20">
        {children ?? null}
      </main>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node,
};

export default MainLayout;
