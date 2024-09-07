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
      className="fixed bottom-5 right-5 rounded-full p-2"
      variant="secondary"
    >
      <ChevronUp className="h-7 w-7" />
    </Button>
  );
};
