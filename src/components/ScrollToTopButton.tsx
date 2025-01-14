import { Button } from "@/components/ui/button";
import { scrollToTop } from "@/lib";
import { ChevronUp } from "lucide-react";

export const ScrollToTopButton = ({ id }: { id: string }) => {
  return (
    <Button
      onClick={() => scrollToTop(id)}
      className="fixed bottom-5 bg-gradient-to-r from-tertiary to-[#cd5c5c] right-5 rounded-full size-12 p-2"
      variant="ghost"
    >
      <ChevronUp className="h-7 w-7 text-white" />
    </Button>
  );
};
