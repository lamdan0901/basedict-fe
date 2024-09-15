"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { jlptLevels } from "@/constants";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useQueryParam } from "@/hooks/useQueryParam";
import { TabVal } from "@/modules/vocabulary/const";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib";
import { useParams } from "next/navigation";
import { SquareMenu } from "lucide-react";

export function VocabNavbar() {
  const isLgScreen = useMediaQuery("(min-width: 1024px)");
  const isXsScreen = useMediaQuery("(min-width: 480px)");

  if (isLgScreen) {
    return <InnerVocabNavbar />;
  }

  return (
    <Sheet>
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
        <InnerVocabNavbar />
      </SheetContent>
    </Sheet>
  );
}

function InnerVocabNavbar() {
  const [tab, setTab] = useQueryParam("tab", TabVal.Levels);

  return (
    <div className="mt-8 lg:mt-0 mb-2">
      <Tabs value={tab} onValueChange={(val) => setTab(val as TabVal)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value={TabVal.Levels}>Theo cấp độ</TabsTrigger>
          <TabsTrigger value={TabVal.VocabBooks}>Theo bộ sách</TabsTrigger>
        </TabsList>
        <TabsContent value={TabVal.Levels}>
          <LevelList />
        </TabsContent>
        <TabsContent value={TabVal.VocabBooks}>
          <VocabBookList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LevelList() {
  const jlptLevel = useParams().level?.[0] ?? "N3";

  return (
    <Card>
      <CardContent className="p-2 flex flex-col items-center gap-y-2">
        {jlptLevels.map((level, i) => (
          <Link
            className="w-full"
            href={`/vocabulary/${level.value}`}
            key={level.value}
          >
            <Button
              className={cn(
                "w-full hover:text-blue-500 ",
                i !== jlptLevels.length - 1 && "mb-2",
                level.value === jlptLevel && "text-blue-500 font-semibold"
              )}
              variant={"ghost"}
            >
              Cấp độ {level.title}
            </Button>
            {i !== jlptLevels.length - 1 && <Separator />}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

function VocabBookList() {
  return (
    <Card>
      <CardContent className="p-2">
        Tính năng đang phát triển và sẽ sớm ra mắt
      </CardContent>
    </Card>
  );
}
