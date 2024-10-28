import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryItemType, MEANING_ERR_MSG } from "@/constants";
import { useQueryParam } from "@/hooks/useQueryParam";
import { trimAllSpaces } from "@/lib";
import { PARAGRAPH_MIN_LENGTH, TransTab } from "@/modules/home/const";
import {
  VnToJpMeaningSection,
  VnToJpMeaningSectionRef,
} from "@/modules/home/TranslationSection/VnToJpTab/VnToJpMeaningSection";
import { JpToVnSearch } from "@/modules/home/TranslationSection/JpToVnTab/JpToVnSearch";
import { JpToVnMeaningSection } from "@/modules/home/TranslationSection/JpToVnTab/JpToVnMeaningSection";
import { SimilarWords } from "@/modules/home/TranslationSection/JpToVnTab/SimilarWords";
import { TranslatedJpToVnParagraph } from "@/modules/home/TranslationSection/JpToVnTab/TranslatedJpToVnParagraph";
import { VnToJpSearch } from "@/modules/home/TranslationSection/VnToJpTab/VnToJpSearch";
import { getRequest, postRequest } from "@/service/data";
import { useHistoryStore } from "@/store/useHistoryStore";
import { useLexemeStore } from "@/store/useLexemeStore";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWRImmutable from "swr/immutable";
import useSWRMutation from "swr/mutation";
import { v4 as uuid } from "uuid";
import {
  TranslatedVnToJpParagraph,
  VnToJpParagraphSectionRef,
} from "./VnToJpTab/TranslatedVnToJpParagraph";
import { useVnToJpTransStore } from "@/store/useVnToJpTransStore";

type TLexemeRef = {
  hideSuggestions: () => void;
  translateParagraph: () => Promise<void>;
};

type Props = {
  _lexemeSearch: TLexeme | undefined;
};

export function TranslationSection({ _lexemeSearch }: Props) {
  const { text, word, selectedVocab, selectedGrammar, setVocabMeaningErrMsg } =
    useLexemeStore();
  const { addHistoryItem } = useHistoryStore();

  const [tab, setTab] = useQueryParam("tab", TransTab.JPToVN);

  const lexemeRef = useRef<TLexemeRef>(null);
  const [initialLexemeSearch, setInitialLexemeSearch] = useState(_lexemeSearch);
  const [initialLexemeText, setInitialLexemeText] = useState(
    _lexemeSearch?.standard ?? ""
  );

  const searchVnToJpText = useVnToJpTransStore((state) => state.searchText);
  const vnToJpMeaningSectionRef = useRef<VnToJpMeaningSectionRef>(null);
  const vnToJpParagraphSectionRef = useRef<VnToJpParagraphSectionRef>(null);

  const isVnToJpParagraphMode = searchVnToJpText.length >= PARAGRAPH_MIN_LENGTH;
  const isParagraphMode = text.length >= PARAGRAPH_MIN_LENGTH;
  const isVocabMode = !isParagraphMode;

  const {
    data: lexemeSearch,
    isLoading: loadingLexemeSearch,
    mutate: retryLexemeSearch,
  } = useSWRImmutable<TLexeme>(
    word ? `/v1/lexemes/search/${trimAllSpaces(word)}` : null,
    getRequest,
    {
      onError(errMsg) {
        setVocabMeaningErrMsg(
          MEANING_ERR_MSG[errMsg as keyof typeof MEANING_ERR_MSG] ??
            MEANING_ERR_MSG.UNKNOWN
        );
        console.error("err searching lexeme: ", errMsg);
      },
      onSuccess(data) {
        addHistoryItem({
          ...data,
          uid: uuid(),
          type: HistoryItemType.Lexeme,
        });
      },
    }
  );
  const {
    trigger: translateParagraph,
    isMutating: translatingParagraph,
    error,
  } = useSWRMutation("/v1/paragraphs/translate", postRequest);

  const effectiveLexemeSearch = lexemeSearch || initialLexemeSearch;

  const onTranslateParagraph = useCallback(
    () => lexemeRef.current?.translateParagraph(),
    []
  );

  useEffect(() => {
    if (lexemeSearch) {
      setInitialLexemeSearch(undefined);
    }
  }, [lexemeSearch]);

  return (
    <div className="py-4 gap-4 sm:flex-row flex-col flex">
      <Tabs
        className="w-full -mt-8 sm:-mt-12"
        value={tab}
        onValueChange={(val) => setTab(val as TransTab)}
      >
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value={TransTab.JPToVN}>Nhật - Việt</TabsTrigger>
          <TabsTrigger value={TransTab.VNToJP}>Việt - Nhật</TabsTrigger>
        </TabsList>
        <TabsContent value={TransTab.JPToVN}>
          <div className="w-full space-y-4">
            <JpToVnSearch
              ref={lexemeRef}
              initialText={initialLexemeText}
              translateParagraph={translateParagraph}
              onClearInitialText={() => {
                setInitialLexemeText("");
              }}
              onInputClear={() => {
                if (initialLexemeSearch) {
                  setInitialLexemeSearch(undefined);
                  setInitialLexemeText("");
                }
              }}
              lexemeSearch={effectiveLexemeSearch}
            />
            <SimilarWords
              similars={
                effectiveLexemeSearch?.similars ||
                selectedVocab?.similars ||
                selectedGrammar?.similars
              }
              onWordClick={() => {
                lexemeRef.current?.hideSuggestions();
              }}
            />
          </div>
        </TabsContent>
        <TabsContent value={TransTab.VNToJP}>
          <VnToJpSearch
            onTranslateWordVnToJp={() =>
              vnToJpMeaningSectionRef.current?.translateWordVnToJp()
            }
            onTranslateParagraphVnToJp={() =>
              vnToJpParagraphSectionRef.current?.translateParagraphVnToJp()
            }
          />
        </TabsContent>
      </Tabs>

      {tab === TransTab.VNToJP ? (
        isVnToJpParagraphMode ? (
          <TranslatedVnToJpParagraph ref={vnToJpParagraphSectionRef} />
        ) : (
          <VnToJpMeaningSection ref={vnToJpMeaningSectionRef} />
        )
      ) : (
        <>
          {isVocabMode && (
            <JpToVnMeaningSection
              lexemeSearch={effectiveLexemeSearch || selectedVocab}
              loadingLexemeSearch={loadingLexemeSearch}
              retryLexemeSearch={retryLexemeSearch}
              wordIdToReport={
                effectiveLexemeSearch?.id || selectedVocab?.id || ""
              }
            />
          )}
          {isParagraphMode && (
            <TranslatedJpToVnParagraph
              error={error}
              isLoading={translatingParagraph}
              onTranslateParagraph={onTranslateParagraph}
            />
          )}
        </>
      )}
    </div>
  );
}
