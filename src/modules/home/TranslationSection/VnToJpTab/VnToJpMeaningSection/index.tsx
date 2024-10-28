import { AddNewFlashcardModal } from "@/components/AddNewFlashcardModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HistoryItemType, MEANING_ERR_MSG } from "@/constants";
import { useQueryParam } from "@/hooks/useQueryParam";
import { cn } from "@/lib";
import { MeaningInDetail } from "@/modules/home/TranslationSection/VnToJpTab/VnToJpMeaningSection/MeaningInDetail";
import { MeaningInPreview } from "@/modules/home/TranslationSection/VnToJpTab/VnToJpMeaningSection/MeaningInPreview";
import { getRequest } from "@/service/data";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import { useVnToJpTransStore } from "@/store/useVnToJpTransStore";
import { ChevronLeft, ChevronRight, CircleChevronDown } from "lucide-react";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { v4 as uuid } from "uuid";

export type VnToJpMeaningSectionRef = {
  translateWordVnToJp: () => Promise<void>;
};

export const VnToJpMeaningSection = memo(
  forwardRef((_, ref) => {
    const [searchParam] = useQueryParam("searchVietnamese", "");
    const { addFavoriteItem, removeFavoriteItem, isFavoriteItem } =
      useFavoriteStore();

    const [addFlashcardModalOpen, setAddFlashcardModalOpen] = useState(false);
    const [showMeaning, setShowMeaning] = useState(false);

    const [lexemeToSearch, setLexemeToSearch] = useState<string>("");
    const [rawTranslatedLexemes, setRawTranslatedLexemes] = useState<string[]>(
      []
    );
    const [meaningErrMsg, setMeaningErrMsg] = useState("");
    const [transErrMsg, setTransErrMsg] = useState("");
    const [meaningIndex, setMeaningIndex] = useState(0);

    const { trigger: translateWordVnToJpTrigger, isMutating } = useSWRMutation<
      string[]
    >(
      `v1/lexemes/vietnamese/${useVnToJpTransStore.getState().searchText}`,
      (url: string) => getRequest(url),
      {
        onError(errMsg) {
          setTransErrMsg(errMsg ?? MEANING_ERR_MSG.UNKNOWN);
        },
        onSuccess() {
          setTransErrMsg("");
        },
      }
    );

    const { data: lexemeSearch, isLoading: searchingLexeme } = useSWR<TLexeme>(
      lexemeToSearch && showMeaning
        ? `/v1/lexemes/search/${lexemeToSearch}`
        : null,
      getRequest,
      {
        onError(errMsg) {
          setMeaningErrMsg(
            MEANING_ERR_MSG[errMsg as keyof typeof MEANING_ERR_MSG] ??
              MEANING_ERR_MSG.UNKNOWN
          );
          console.error("err searching lexeme: ", errMsg);
        },
        onSuccess() {
          setMeaningErrMsg("");
        },
      }
    );

    const isFavorite = isFavoriteItem(lexemeSearch?.id);
    const currentMeaning = lexemeSearch?.meaning?.[meaningIndex];
    const meaningSize = lexemeSearch?.meaning?.length ?? 0;
    const canNext = meaningIndex < meaningSize - 1;
    const canPrev = meaningIndex > 0;

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
      setMeaningIndex(0);
      setShowMeaning(false);
      if (searchParam) setRawTranslatedLexemes([]);
    }, [searchParam]);

    const translateWordVnToJp = useCallback(async () => {
      if (!useVnToJpTransStore.getState().searchText) return;

      const data = await translateWordVnToJpTrigger();
      setRawTranslatedLexemes(data);
      setLexemeToSearch(data?.[0]);
    }, [translateWordVnToJpTrigger]);

    useImperativeHandle(
      ref,
      () => ({
        translateWordVnToJp,
      }),
      [translateWordVnToJp]
    );

    return (
      <>
        <div className="mx-auto sm:hidden">
          <Button
            className="w-fit"
            onClick={translateWordVnToJp}
            variant={"outline"}
          >
            Dịch từ
          </Button>
        </div>

        <Card
          className={cn("w-full rounded-2xl min-h-[328px] h-fit relative ")}
        >
          <CardContent className="!p-4 space-y-1">
            {isMutating ? (
              <span>Đang dịch...</span>
            ) : transErrMsg ? (
              <span className="text-destructive">
                Không thể dịch nghĩa từ hoặc có lỗi xảy ra.
                <br /> Vui lòng thử lại hoặc dịch từ khác.
              </span>
            ) : rawTranslatedLexemes.length > 0 ? (
              <>
                <MeaningInPreview
                  lexemeSearch={lexemeSearch}
                  lexemeToSearch={lexemeToSearch}
                  rawTranslatedLexemes={rawTranslatedLexemes}
                  onLexemeSelect={(lexeme) => {
                    setShowMeaning(false);
                    setLexemeToSearch(lexeme);
                  }}
                />

                <Button
                  onClick={() => setShowMeaning((prev) => !prev)}
                  variant={"ghost"}
                  className="p-1 h-8"
                >
                  <CircleChevronDown
                    className={cn(
                      "size-5 mr-2",
                      showMeaning ? "rotate-180" : ""
                    )}
                  />
                  {showMeaning ? "Ẩn ý nghĩa" : "Hiện ý nghĩa"}
                </Button>

                <div className="flex gap-1">
                  <div className="border-t mx-1 h-[1px] border-muted-foreground border-dashed w-full"></div>
                  {meaningSize > 1 && (
                    <div className="flex items-center -mt-[14px] shrink-0 -mr-1 gap-1">
                      <Button
                        size={"sm"}
                        disabled={!canPrev}
                        variant={"ghost"}
                        onClick={() => setMeaningIndex(meaningIndex - 1)}
                        className="p-1 text-muted-foreground h-fit rounded-full"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <Button
                        size={"sm"}
                        disabled={!canNext}
                        variant={"ghost"}
                        onClick={() => setMeaningIndex(meaningIndex + 1)}
                        className="p-1 text-muted-foreground h-fit rounded-full"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  {searchingLexeme ? (
                    <span>Đang tìm nghĩa...</span>
                  ) : lexemeSearch ? (
                    <MeaningInDetail
                      onToggleFavorite={toggleFavorite}
                      onOpenAddFlashcardModal={() =>
                        setAddFlashcardModalOpen(true)
                      }
                      isFavorite={isFavorite}
                      currentMeaning={currentMeaning}
                    />
                  ) : meaningErrMsg ? (
                    <span className="text-destructive">{meaningErrMsg}</span>
                  ) : null}
                </div>
              </>
            ) : null}
          </CardContent>

          <AddNewFlashcardModal
            lexeme={lexemeSearch}
            currentMeaning={currentMeaning}
            open={addFlashcardModalOpen}
            onOpenChange={setAddFlashcardModalOpen}
          />
        </Card>
      </>
    );
  })
);
