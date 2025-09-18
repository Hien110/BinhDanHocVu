import React from "react";
import PropTypes from "prop-types";
import Header from "../components/Header";
import SidebarLecturer from "../components/SidebarLecturer";
import { Button } from "../components/ui/button";

const isBrowser = typeof window !== "undefined";

function ScrollToTopButton() {
  const [visible, setVisible] = React.useState(false);

  const updateVisible = React.useCallback(() => {
    if (!isBrowser) return;
    setVisible(window.scrollY > 200);
  }, []);

  React.useEffect(() => {
    if (!isBrowser) return;

    let rafId = null;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateVisible);
    };

    // trạng thái ban đầu
    updateVisible();

    // passive để cuộn mượt hơn
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
      window.scrollTo(0, 0);
    }
  }, []);

  if (!visible) return null;

  return (
    <Button
      onClick={scrollToTop}
      variant="default"
      size="icon"
      className="cursor-pointer fixed bottom-8 right-8 z-50 rounded-xl border border-custom-blue bg-white text-custom-blue shadow-lg hover:bg-custom-hover-blue2 transition"
      aria-label="Lên đầu trang"
      type="button"
    >
      <span className="text-2xl" aria-hidden>
        ↑
      </span>
    </Button>
  );
}

function AdminLayout(props) {
  // phòng thủ: tránh destructuring từ null/undefined
  const { children } = props ?? {};

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* 
        Nếu Header có vị trí fixed, cân chỉnh padding-top cho vùng nội dung.
        'pt-24' = 6rem, bạn có thể đổi theo đúng chiều cao Header.
      */}
      <SidebarLecturer className="z-40">
        <main className="w-full p-6 pt-24">{children ?? null}</main>
      </SidebarLecturer>

      <ScrollToTopButton />
    </div>
  );
}

AdminLayout.propTypes = {
  children: PropTypes.node,
};

export default AdminLayout;
