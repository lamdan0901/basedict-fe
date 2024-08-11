import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, getLocalStorageItem } from "@/lib";
import { postRequest } from "@/service/data";
import { Check, CircleCheckBig, Flag, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { type KeyedMutator } from "swr";
import useSWRMutation from "swr/mutation";

type MeaningSectionProps = {
  lexemeSearch: TLexeme | undefined;
  meaningErrMsg: string;
  loadingLexemeSearch: boolean;
  wordIdToReport: string;
  retryLexemeSearch: KeyedMutator<TLexeme>;
};

export function MeaningSection({
  lexemeSearch,
  meaningErrMsg,
  loadingLexemeSearch,
  wordIdToReport,
  retryLexemeSearch,
}: MeaningSectionProps) {
  // const [meaningReportModalOpen, setMeaningReportModalOpen] = useState(false);
  const [meaningSelectorOpen, setMeaningSelectorOpen] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [meaningIndex, setMeaningIndex] = useState(0);
  const [isWordReported, setIsWordReported] = useState<boolean | null>(null);
  const reportedWords = getLocalStorageItem("reportedWords", {});

  const currentMeaning = lexemeSearch?.meaning?.[meaningIndex];

  const { trigger: reportWrongWordTrigger, isMutating: isReportingWrongWord } =
    useSWRMutation(`/v1/lexemes/report-wrong/${wordIdToReport}`, postRequest);

  async function reportWrongWord() {
    if (isWordReported || !wordIdToReport) return;

    await reportWrongWordTrigger();

    setIsWordReported(true);
    reportedWords[wordIdToReport] = "true";
    localStorage.setItem("reportedWords", JSON.stringify(reportedWords));
    // TODO: Thế thêm cho a cái là khi báo cáo xong đồng thời call cả báo sai nhé
  }

  useEffect(() => {
    setIsWordReported(reportedWords[wordIdToReport] === "true");
  }, [reportedWords, wordIdToReport]);

  return (
    <Card className="w-full rounded-2xl min-h-[325px] relative ">
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
                    <Button className="text-2xl px-1" variant={"ghost"}>
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
                {lexemeSearch.approved && (
                  <CircleCheckBig className="text-green-500 w-4 h-4 mb-1" />
                )}
              </div>

              <div className="flex gap-2 items-center">
                {currentMeaning?.context && (
                  <div className="bg-slate-50 text-black rounded-full px-6 text-sm border">
                    {currentMeaning?.context}
                  </div>
                )}
                <Button className="rounded-full p-2" size="sm" variant="ghost">
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
              disabled={
                isReportingWrongWord || isWordReported || !wordIdToReport
              }
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
        ) : meaningErrMsg ? (
          <div>
            <Button
              onClick={() => retryLexemeSearch()}
              variant={"link"}
              className="text-xl px-1"
            >
              <RotateCcw className="w-5 h-5 mr-2" /> Thử lại
            </Button>
            <p className="text-destructive">{meaningErrMsg}</p>
          </div>
        ) : null}
      </CardContent>

      {/* TODO */}
      {/* <MeaningReportModal
        lexeme={lexemeSearch || selectedLexeme}
        open={meaningReportModalOpen}
        onOpenChange={setMeaningReportModalOpen}
      /> */}
    </Card>
  );
}
