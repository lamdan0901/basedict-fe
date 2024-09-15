"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib";
import { SquareMenu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menu = [
  {
    title: "Khám phá",
    href: "/flashcard",
  },
  {
    title: "Tìm kiếm Flashcard",
    href: "/flashcard/search",
  },
  {
    title: "Flashcard của tôi",
    href: "/flashcard/my-flashcard",
  },
];

export function FlashcardNavbar() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const isLgScreen = useMediaQuery("(min-width: 1024px)");
  const isXsScreen = useMediaQuery("(min-width: 480px)");

  if (isLgScreen) {
    return <InnerFlashcardNavbar />;
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant={"outline"}
          className="p-2 gap-2 absolute -top-1 left-0 mt-1 text-primary"
        >
          <SquareMenu className="size-6" />
          <span className={cn("text-ls", isXsScreen ? "inline" : "hidden")}>
            Menu
          </span>
        </Button>
      </SheetTrigger>
      <SheetTitle></SheetTitle>
      <SheetContent aria-describedby={undefined} side="left">
        <InnerFlashcardNavbar onMenuItemClick={() => setSheetOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

function InnerFlashcardNavbar({
  onMenuItemClick,
}: {
  onMenuItemClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="mt-8 lg:mt-0 mb-2">
      <Card>
        <CardContent className="p-2 flex flex-col items-center gap-y-2">
          {menu.map((item, i) => (
            <Link className="w-full" href={item.href} key={item.href}>
              <Button
                className={cn(
                  "w-full hover:text-blue-500 ",
                  i !== menu.length - 1 && "mb-2",
                  item.href === pathname && "text-blue-500 font-semibold"
                )}
                variant={"ghost"}
                onClick={() => onMenuItemClick?.()}
              >
                {item.title}
              </Button>
              {i !== menu.length - 1 && <Separator />}
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
