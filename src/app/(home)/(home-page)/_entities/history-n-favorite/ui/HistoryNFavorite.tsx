"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useHistoryStore } from "@/store/useHistoryStore";
import { HistoryItemType } from "@/shared/constants";
import { ChevronRight, Trash } from "lucide-react";
import { cn } from "@/shared/lib";
import { useLexemeStore } from "@/features/translation/model/store";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import { usePathname } from "next/navigation";
import { shallow } from "zustand/shallow";

enum SheetType {
  History = "Lịch sử",
  Favorite = "Yêu thích",
}

export function HistoryNFavorite() {
  const pathname = usePathname();
  const { historyItems, clearHistory } = useHistoryStore();
  const { favoriteItems, clearFavorite, removeFavoriteItem } =
    useFavoriteStore();
  const {
    setSelectedGrammar,
    setSelectedVocab,
    setTranslatedParagraph,
    setText,
  } = useLexemeStore(
    (state) => ({
      setSelectedGrammar: state.setSelectedGrammar,
      setSelectedVocab: state.setSelectedVocab,
      setTranslatedParagraph: state.setTranslatedParagraph,
      setText: state.setText,
    }),
    shallow
  );
  const [sheetType, setSheetType] = useState<SheetType | null>(null);

  const data = sheetType === SheetType.History ? historyItems : favoriteItems;

  if (pathname !== "/") return <div className="mt-24"></div>;

  return (
    <>
      <div className="flex mt-4 justify-center gap-4">
        <Button
          className="hover:bg-gray-300/30 py-10 text-[#444]  text-lg flex-col"
          variant="ghost"
          onClick={() => setSheetType(SheetType.History)}
        >
          <Image src={"/history.svg"} width={40} height={40} alt={"lich-su"} />
          Lịch sử
        </Button>
        <Button
          className="hover:bg-gray-300/30 py-10 text-[#444]  text-lg flex-col"
          variant="ghost"
          onClick={() => setSheetType(SheetType.Favorite)}
        >
          <Image
            src={"/favorite.svg"}
            width={40}
            height={40}
            alt={"yeu-thich"}
          />
          Yêu thích
        </Button>
      </div>

      <Sheet open={!!sheetType} onOpenChange={() => setSheetType(null)}>
        <SheetTitle></SheetTitle>
        <SheetContent aria-describedby={undefined} side="right">
          <h2 className="text-2xl border-b-2 pb-4 border-muted-foreground">
            {sheetType}
          </h2>

          {data.length > 0 && (
            <Button
              size={"sm"}
              variant={"link"}
              onClick={
                sheetType === SheetType.History ? clearHistory : clearFavorite
              }
              className="p-1 block ml-auto text-destructive  my-2"
            >
              Xoá toàn bộ
            </Button>
          )}

          <div className="mt-4">
            {data.length === 0 ? "Không có dữ liệu" : ""}
          </div>

          <div className="space-y-2 h-[calc(100vh-130px)] overflow-auto">
            {data.map((item, i) => {
              const isEven = i % 2 === 0;

              switch (item.type) {
                case HistoryItemType.Lexeme:
                  const lexeme =
                    item.lexeme !== item.standard ? `(${item.lexeme})` : "";

                  return (
                    <div
                      key={item.uid}
                      onClick={() => {
                        setSelectedVocab(item);
                        setText(item.standard);
                      }}
                      className={cn(
                        "flex group relative items-center gap-2 cursor-pointer hover:bg-gray-300/50 rounded transition-all p-2 justify-between",
                        isEven && "bg-muted"
                      )}
                    >
                      <div className=" w-[124px]">
                        <div className="text-lg truncate font-semibold">
                          {item.lexeme}
                        </div>
                        <div className="truncate">
                          {item.hiragana} {lexeme}
                        </div>
                      </div>
                      <ChevronRight className="size-10 text-muted-foreground shrink-0" />{" "}
                      <div className=" w-[124px]">
                        <div className="text-lg truncate font-semibold">
                          {item.meaning[0].meaning}
                        </div>
                        <div className=" truncate">{item.hanviet}</div>
                      </div>
                      {sheetType === SheetType.Favorite && (
                        <Button
                          className={
                            "rounded-full group-hover:block hidden absolute p-1 h-8 z-10 top-0 right-0"
                          }
                          size={"sm"}
                          variant={"ghost"}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFavoriteItem(item.id);
                          }}
                        >
                          <Trash className="text-destructive size-5" />
                        </Button>
                      )}
                    </div>
                  );

                case HistoryItemType.Grammar:
                  return (
                    <div
                      key={item.uid}
                      onClick={() => {
                        setSelectedGrammar(item);
                        setText(item.grammar);
                      }}
                      className={cn(
                        "flex group relative items-center h-[68px] gap-2 cursor-pointer hover:bg-gray-300/50 rounded transition-all p-2 justify-between",
                        isEven && "bg-muted"
                      )}
                    >
                      <div className="text-lg w-[124px] truncate font-semibold">
                        {item.grammar}
                      </div>
                      <ChevronRight className="size-10 text-muted-foreground shrink-0" />
                      <div className="text-lg w-[124px] truncate font-semibold">
                        {item.meaning}
                      </div>

                      {sheetType === SheetType.Favorite && (
                        <Button
                          className={
                            "rounded-full group-hover:block hidden absolute p-1 h-8 z-10 top-0 right-0"
                          }
                          size={"sm"}
                          variant={"ghost"}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFavoriteItem(item.id);
                          }}
                        >
                          <Trash className="text-destructive size-5" />
                        </Button>
                      )}
                    </div>
                  );

                case HistoryItemType.Paragraph:
                  return (
                    <div
                      key={item.uid}
                      onClick={() => {
                        setTranslatedParagraph({
                          translated: item.translatedParagraph,
                          usedCount: 3,
                        });
                        setText(item.rawParagraph);
                      }}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer hover:bg-gray-300/50 rounded transition-all p-2 justify-between",
                        isEven && "bg-muted"
                      )}
                    >
                      <div className="w-[124px] line-clamp-2">
                        {item.rawParagraph}
                      </div>
                      <ChevronRight className="size-10 text-muted-foreground shrink-0" />
                      <div className="w-[124px] line-clamp-2">
                        {item.translatedParagraph}
                      </div>
                    </div>
                  );
              }
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
