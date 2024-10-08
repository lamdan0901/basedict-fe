import { AddNewFlashcardModal } from "@/components/AddNewFlashcardModal";
import { CardIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HistoryItemType } from "@/constants";
import { cn, getLocalStorageItem } from "@/lib";
import { MeaningReportModal } from "@/modules/home/MeaningSection/MeaningReportModal";
import { isDifferenceGreaterSpecifiedDay } from "@/modules/home/utils";
import { postRequest } from "@/service/data";
import { useAppStore } from "@/store/useAppStore";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import { useLexemeStore } from "@/store/useLexemeStore";
import { Check, CircleCheckBig, Flag, Heart, RotateCcw } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { type KeyedMutator } from "swr";
import useSWRMutation from "swr/mutation";
import { v4 as uuid } from "uuid";
import { shallow } from "zustand/shallow";

type MeaningSectionProps = {
  lexemeSearch: TLexeme | null | undefined;
  loadingLexemeSearch: boolean;
  wordIdToReport: string;
  retryLexemeSearch: KeyedMutator<TLexeme>;
};

export const MeaningSection = memo<MeaningSectionProps>(
  ({
    lexemeSearch,
    loadingLexemeSearch,
    wordIdToReport,
    retryLexemeSearch,
  }) => {
    const profile = useAppStore((state) => state.profile?.id);
    const {
      canShowFlashcardTips,
      canShowMeaningTips,
      hideFlashcardTips,
      hideMeaningTips,
    } = useAppStore(
      (state) => ({
        canShowFlashcardTips: state.canShowFlashcardTips,
        canShowMeaningTips: state.canShowMeaningTips,
        hideFlashcardTips: state.hideFlashcardTips,
        hideMeaningTips: state.hideMeaningTips,
      }),
      shallow
    );
    const { addFavoriteItem, removeFavoriteItem, isFavoriteItem } =
      useFavoriteStore();
    const vocabMeaningErrMsg = useLexemeStore(
      (state) => state.vocabMeaningErrMsg
    );

    const [shouldShowMeaningTips, toggleMeaningTips] = useState(false);
    const [shouldShowFlashcardTips, toggleFlashcardTips] = useState(false);
    const [meaningReportModalOpen, setMeaningReportModalOpen] = useState(false);
    const [addFlashcardModalOpen, setAddFlashcardModalOpen] = useState(false);
    const [meaningSelectorOpen, setMeaningSelectorOpen] = useState(false);
    const [showExamples, setShowExamples] = useState(false);
    const [meaningIndex, setMeaningIndex] = useState(0);

    const [isWordReported, setIsWordReported] = useState<boolean | null>(null);
    const reportedWords = getLocalStorageItem("reportedWords", {});

    const isFavorite = isFavoriteItem(lexemeSearch?.id);
    const currentMeaning = lexemeSearch?.meaning?.[meaningIndex];

    const {
      trigger: reportWrongWordTrigger,
      isMutating: isReportingWrongWord,
    } = useSWRMutation(
      `/v1/lexemes/report-wrong/${wordIdToReport}`,
      postRequest
    );

    async function reportWrongWord() {
      if (isWordReported || !wordIdToReport) return;

      await reportWrongWordTrigger();

      setIsWordReported(true);
      reportedWords[wordIdToReport] = new Date().toISOString();
      localStorage.setItem("reportedWords", JSON.stringify(reportedWords));
    }

    function toggleFavorite() {
      if (!lexemeSearch) return;

      if (isFavorite) {
        removeFavoriteItem(lexemeSearch?.id);
      } else {
        addFavoriteItem({
          ...lexemeSearch,
          uid: uuid(),
          type: HistoryItemType.Lexeme,
        });
      }
    }

    useEffect(() => {
      setIsWordReported(
        reportedWords[wordIdToReport] &&
          !isDifferenceGreaterSpecifiedDay(reportedWords[wordIdToReport])
      );
    }, [reportedWords, wordIdToReport]);

    useEffect(() => {
      if (
        canShowMeaningTips &&
        lexemeSearch &&
        lexemeSearch?.meaning.length >= 2
      ) {
        toggleMeaningTips(true);
        return;
      }
      if (canShowFlashcardTips && lexemeSearch) {
        toggleFlashcardTips(true);
      }
    }, [canShowFlashcardTips, canShowMeaningTips, lexemeSearch]);

    // Reset the meaning index when the lexeme search changes
    useEffect(() => {
      setMeaningIndex(0);
    }, [lexemeSearch?.id]);

    return (
      <Card
        className={cn(
          "w-full rounded-2xl sm:min-h-[328px] h-fit relative ",
          !lexemeSearch && "min-h-[328px]"
        )}
      >
        <CardContent className="!p-4 !pb-10 space-y-2">
          {loadingLexemeSearch ? (
            "Đang tìm kiếm..."
          ) : lexemeSearch ? (
            <>
              <div className="flex justify-between items-center">
                <div className="flex gap-1 items-center">
                  <Popover
                    open={meaningSelectorOpen}
                    onOpenChange={setMeaningSelectorOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        className="sm:text-2xl whitespace-pre-wrap text-start text-xl px-1"
                        variant={"ghost"}
                      >
                        {currentMeaning?.meaning}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit min-w-40 px-0">
                      <Command className="p-0">
                        <CommandList>
                          {lexemeSearch.meaning.map((m, i) => (
                            <CommandItem
                              key={i}
                              className="text-xl"
                              onSelect={() => {
                                setMeaningIndex(i);
                                setMeaningSelectorOpen(false);
                              }}
                            >
                              {m.meaning}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {canShowMeaningTips && (
                    <Popover
                      open={shouldShowMeaningTips}
                      onOpenChange={(open) => {
                        toggleMeaningTips(open);
                        if (!open) {
                          if (canShowFlashcardTips && lexemeSearch) {
                            toggleFlashcardTips(true);
                          }
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <button className="h-2"></button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="p-1.5 bg-red-100 w-[195px]"
                        side="top"
                        align="start"
                      >
                        <div className="text-sm">
                          Tips: Bấm vào nghĩa của từ để xem các nghĩa khác
                        </div>
                        <div className="flex items-center mt-1 space-x-2">
                          <Checkbox
                            onCheckedChange={() =>
                              setTimeout(() => hideMeaningTips(), 800)
                            }
                            id="meaning-tips"
                          />
                          <label htmlFor="meaning-tips" className="text-xs">
                            Không hiện tips này nữa
                          </label>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                  {lexemeSearch.approved && (
                    <CircleCheckBig className="text-green-500 w-4 h-4 mb-1" />
                  )}
                </div>

                <div className="flex gap-2 relative items-center">
                  {currentMeaning?.context && (
                    <div className="bg-slate-50 text-black rounded-full px-6 text-sm border">
                      {currentMeaning?.context}
                    </div>
                  )}
                  {profile && (
                    <Button
                      onClick={() => setAddFlashcardModalOpen(true)}
                      className="rounded-full p-2"
                      size="sm"
                      variant="ghost"
                      title="Thêm vào bộ flashcard"
                    >
                      <CardIcon />
                    </Button>
                  )}
                  {profile && canShowFlashcardTips && (
                    <Popover
                      open={shouldShowFlashcardTips}
                      onOpenChange={toggleFlashcardTips}
                    >
                      <PopoverTrigger asChild>
                        <button className="size-1 absolute top-2"></button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="p-1.5 bg-red-100 w-[210px]"
                        side="top"
                        align="center"
                      >
                        <div className="text-sm">
                          Tips: Bạn có thể thêm từ này vào bộ flash card của bạn
                        </div>
                        <div className="flex items-center mt-1 space-x-2">
                          <Checkbox
                            onCheckedChange={() =>
                              setTimeout(() => hideFlashcardTips(), 800)
                            }
                            id="flashcard-tips"
                          />
                          <label htmlFor="flashcard-tips" className="text-xs">
                            Không hiện tips này nữa
                          </label>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                  <Button
                    onClick={toggleFavorite}
                    className="rounded-full p-2"
                    size="sm"
                    variant="ghost"
                    title="Thêm vào danh sách yêu thích"
                  >
                    <Heart
                      className={cn(
                        " w-5 h-5",
                        isFavorite && "text-destructive"
                      )}
                    />
                  </Button>
                  <Button
                    onClick={() => {
                      setMeaningReportModalOpen(true);
                    }}
                    className="rounded-full p-2"
                    size="sm"
                    variant="ghost"
                    title="Báo cáo từ này"
                  >
                    <Flag className=" w-5 h-5" />
                  </Button>
                </div>
              </div>

              <p className="pl-1">{currentMeaning?.explaination}</p>

              {currentMeaning?.example && (
                <div>
                  <Button
                    onClick={() => setShowExamples((prev) => !prev)}
                    className="underline text-base px-1"
                    variant={"link"}
                  >
                    {showExamples ? "Ẩn" : "Xem"} ví dụ
                  </Button>
                  <p
                    className={cn(
                      "whitespace-pre-line",
                      showExamples ? "block" : "hidden"
                    )}
                  >
                    {currentMeaning?.example}
                  </p>
                </div>
              )}

              <Button
                className="absolute bottom-3 underline hover:font-semibold text-blue-500 right-2"
                variant="link"
                size={"sm"}
                disabled={isReportingWrongWord || !!isWordReported}
                onClick={reportWrongWord}
              >
                {isWordReported ? (
                  <>
                    Đã báo <Check className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  "Báo từ sai"
                )}
              </Button>
            </>
          ) : vocabMeaningErrMsg ? (
            <div>
              <Button
                onClick={() => retryLexemeSearch()}
                variant={"link"}
                className="text-xl px-1"
              >
                <RotateCcw className="w-5 h-5 mr-2" /> Thử lại
              </Button>
              <p className="text-destructive">{vocabMeaningErrMsg}</p>
            </div>
          ) : null}

          <p
            className={cn(
              "absolute top-1/2 left-5 w-[90%] sm:text-base text-sm text-muted-foreground -translate-y-1/2 pointer-events-none",
              lexemeSearch ? "hidden" : "block"
            )}
          >
            Tips: <br />
            - Hãy bấm vào phần dịch nghĩa để xem các nghĩa khác của từ. <br />-
            Bạn có thể quét chọn 1 từ tiếng nhật bất kì, click "Dịch từ" để dịch
            nhanh.
          </p>
        </CardContent>

        <MeaningReportModal
          lexeme={lexemeSearch}
          open={meaningReportModalOpen}
          onOpenChange={setMeaningReportModalOpen}
          onMeaningReported={reportWrongWord}
        />

        <AddNewFlashcardModal
          lexeme={lexemeSearch}
          currentMeaning={currentMeaning}
          open={addFlashcardModalOpen}
          onOpenChange={setAddFlashcardModalOpen}
        />
      </Card>
    );
  },
  (prev, next) =>
    prev.lexemeSearch?.id === next.lexemeSearch?.id &&
    prev.loadingLexemeSearch === next.loadingLexemeSearch &&
    prev.wordIdToReport === next.wordIdToReport
);
