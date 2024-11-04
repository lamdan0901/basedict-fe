"use client";

import { ExploreIcon, CardIcon } from "@/components/icons";
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
import { getRequest } from "@/service/data";
import { GraduationCap, Search, SquareMenu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";
import useSWR from "swr";

const menu = [
  {
    title: "Khám phá",
    href: "/flashcard",
    icon: <ExploreIcon />,
  },
  {
    title: "Tìm kiếm Flashcard",
    href: "/flashcard/search",
    icon: <Search className="size-6" />,
  },
  {
    title: "Flashcard của tôi",
    href: "/flashcard/my-flashcard",
    icon: <CardIcon />,
    withSubItems: true,
  },
  {
    title: "Flashcard đang học",
    href: "/flashcard/my-flashcard",
    icon: <GraduationCap className="size-6" />,
    withSubItems: true,
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
      <SheetContent
        className="bg-gray-50"
        aria-describedby={undefined}
        side="left"
      >
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
  const { data: myFlashcardSet } = useSWR<TMyFlashcard>(
    `/v1/flash-card-sets/my-flash-card`,
    getRequest
  );

  const myFlashCards = myFlashcardSet?.myFlashCards ?? [];
  const learningFlashCards = myFlashcardSet?.learningFlashCards ?? [];

  const cardsMap: Record<string, TFlashcardSet[]> = {
    "Flashcard của tôi": myFlashCards,
    "Flashcard đang học": learningFlashCards,
  };

  return (
    <div className="mt-8 lg:mt-0 mb-2">
      <Card>
        <CardContent className="p-2 flex flex-col items-center gap-y-2">
          {menu.map((item, i) => (
            <Fragment key={item.href + i}>
              <Link className="w-full" href={item.href}>
                <Button
                  className={cn(
                    "w-full justify-start gap-2 hover:text-blue-500 ",
                    item.href === pathname && "text-blue-500 font-semibold",
                    item.withSubItems && "font-semibold"
                  )}
                  variant={"ghost"}
                  onClick={onMenuItemClick}
                >
                  {item.icon}
                  {item.title}
                </Button>
              </Link>
              {item.withSubItems &&
                cardsMap[item.title].map((item) => (
                  <Link
                    className="w-full"
                    key={item.id}
                    href={`/flashcard/${item.id}`}
                  >
                    <Button
                      className={cn(
                        "w-full block truncate font-normal hover:text-blue-500 ",
                        `/flashcard/${item.id}` === pathname && "text-blue-500"
                      )}
                      variant={"ghost"}
                      onClick={onMenuItemClick}
                    >
                      {item.title}
                    </Button>
                  </Link>
                ))}
              {i !== menu.length - 1 && <Separator />}
            </Fragment>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
