import React from "react";
import Header from "../components/Header";
import SidebarAdmin from "../components/SidebarAdmin";

import { Button } from "../components/ui/button"; // Thêm dòng này


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
        round="lg"
        className="cursor-pointer fixed bottom-8 right-8 z-50 border border-custom-blue bg-white text-custom-blue shadow-lg hover:bg-custom-hover-blue2 transition"
        aria-label="Lên đầu trang"
      >
        <span className="text-2xl">↑</span>
      </Button>
    )
  );
}

function AdminLayout({ children }) {
  return (
    <div>
      <Header />
      <SidebarAdmin className="z-40">
        <div className="p-6 pt-25">
          {children}
        </div>
      </SidebarAdmin>
      <ScrollToTopButton />
    </div>
  );
}

export default AdminLayout;
