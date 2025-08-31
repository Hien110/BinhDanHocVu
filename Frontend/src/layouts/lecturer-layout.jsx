import React from "react";
import Header from "../components/Header";
import SidebarLecturer from "../components/SidebarLecturer";

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
        className="cursor-pointer fixed bottom-8 right-8 z-50 border border-red-600 bg-white text-red-600 shadow-lg hover:bg-red-50 transition"
        aria-label="Lên đầu trang"
      >
        <span className="text-2xl">↑</span>
      </Button>
    )
  );
}

function LecturerLayout({ children }) {
  return (
    <div>
      <Header />
      <SidebarLecturer className="z-40">
        <div className="p-6 pt-25">
          {children}
        </div>
        </SidebarLecturer>
      <ScrollToTopButton />
    </div>
  );
}

export default LecturerLayout;
