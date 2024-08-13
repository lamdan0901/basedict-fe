import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MEANING_ERR_MSG } from "@/constants";
import { cn, trimAllSpaces } from "@/lib";
import { getRequest } from "@/service/data";
import { useLexemeStore } from "@/store/useLexemeStore";
import { Flag, RotateCcw } from "lucide-react";
import { useState } from "react";
import useSWRImmutable from "swr/immutable";

export function GrammarSection() {
  const {
    selectedGrammar,
    setSelectedGrammar,
    grammar,
    grammarMeaningErrMsg,
    setGrammarMeaningErrMsg,
  } = useLexemeStore();
  const [showExamples, setShowExamples] = useState(false);

  console.log("render");

  const {
    data: grammarSearchRes,
    isLoading: loadingGrammarSearch,
    mutate: retryGrammarSearch,
  } = useSWRImmutable<TGrammar>(
    grammar ? `/v1/grammars/${trimAllSpaces(grammar)}` : null,
    getRequest,
    {
      onError(errMsg) {
        setGrammarMeaningErrMsg(
          MEANING_ERR_MSG[errMsg as keyof typeof MEANING_ERR_MSG] ??
            MEANING_ERR_MSG.UNKNOWN
        );
        console.error("err searching lexeme: ", errMsg);
      },
      onSuccess(data) {
        setSelectedGrammar(data);
      },
    }
  );
  const grammarSearch = selectedGrammar || grammarSearchRes;

  return (
    <Card className="w-full rounded-2xl sm:min-h-[325px] relative ">
      <CardContent className="!p-4 space-y-2">
        {loadingGrammarSearch ? (
          "Đang tìm kiếm..."
        ) : grammarSearch ? (
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
        ) : grammarMeaningErrMsg ? (
          <div>
            <Button
              onClick={() => retryGrammarSearch()}
              variant={"link"}
              className="text-xl px-1"
            >
              <RotateCcw className="w-5 h-5 mr-2" /> Thử lại
            </Button>
            <p className="text-destructive">{grammarMeaningErrMsg}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
