import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

export const ScrollToTopButton = () => {
  const scrollToTop = () => {
    const topEl = document.querySelector("#top-of-jlpt-test");
    topEl?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-5 bg-gradient-to-r from-[#8b0000] to-[#cd5c5c] right-5 rounded-full size-12 p-2"
      variant="ghost"
    >
      <ChevronUp className="h-7 w-7 text-white" />
    </Button>
  );
};
