import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib";
import { useLexemeStore } from "@/store/useLexemeStore";
import { Flag } from "lucide-react";
import { useState } from "react";

export function GrammarSection() {
  const { selectedGrammar: grammarSearch } = useLexemeStore();
  const [showExamples, setShowExamples] = useState(false);

  // const {
  //   data: grammarSearchRes,
  //   isLoading: loadingGrammarSearch,
  //   mutate: retryGrammarSearch,
  // } = useSWRImmutable<TGrammar>(
  //   grammar ? `/v1/grammars/${trimAllSpaces(grammar)}` : null,
  //   getRequest,
  //   {
  //     onError(errMsg) {
  //       setGrammarMeaningErrMsg(
  //         MEANING_ERR_MSG[errMsg as keyof typeof MEANING_ERR_MSG] ??
  //           MEANING_ERR_MSG.UNKNOWN
  //       );
  //       console.error("err searching lexeme: ", errMsg);
  //     },
  //     onSuccess(data) {
  //       setSelectedGrammar(data);
  //     },
  //   }
  // );

  return (
    <Card
      className={cn(
        "w-full rounded-2xl sm:min-h-[325px] h-fit relative ",
        !grammarSearch && "min-h-[325px]"
      )}
    >
      <CardContent className="!p-4 space-y-2">
        {grammarSearch ? (
          <>
            <div className="flex justify-between items-center">
              <div className="flex gap-1 items-center">
                <h2 className="sm:text-2xl text-xl">
                  {" "}
                  {grammarSearch?.meaning}
                </h2>
              </div>

              <div className="flex gap-2 items-center">
                {grammarSearch?.jlptLevel && (
                  <div className="bg-slate-50 text-black rounded-full px-6 text-sm border">
                    {grammarSearch?.jlptLevel}
                  </div>
                )}
                <Button className="rounded-full p-2" size="sm" variant="ghost">
                  <Flag className=" w-5 h-5" />
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Cấu trúc</h3>
              <p className="">{grammarSearch?.structure}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Giải nghĩa</h3>
              <p className="">{grammarSearch?.summary}</p>
            </div>
            {grammarSearch?.detail && (
              <div>
                <Button
                  onClick={() => setShowExamples((prev) => !prev)}
                  className="underline text-base px-0"
                  variant={"link"}
                >
                  {showExamples ? "Thu gọn" : "Chi tiết"}
                </Button>
                <p
                  className={cn(
                    "whitespace-pre-line",
                    showExamples ? "block" : "hidden"
                  )}
                >
                  {grammarSearch?.detail}
                </p>
              </div>
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
