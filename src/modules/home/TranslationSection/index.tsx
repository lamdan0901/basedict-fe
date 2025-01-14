import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryItemType, MEANING_ERR_MSG } from "@/constants";
import { trimAllSpaces } from "@/lib";
import { PARAGRAPH_MIN_LENGTH, TransTab } from "@/modules/home/const";
import { JpToVnMeaningSection } from "@/modules/home/TranslationSection/JpToVnTab/JpToVnMeaningSection";
import {
  JpToVnSearch,
  JpToVnSearchRef,
} from "@/modules/home/TranslationSection/JpToVnTab/JpToVnSearch";
import { SimilarWords } from "@/modules/home/TranslationSection/JpToVnTab/SimilarWords";
import {
  JpToVnParagraphSectionRef,
  TranslatedJpToVnParagraph,
} from "@/modules/home/TranslationSection/JpToVnTab/TranslatedJpToVnParagraph";
import {
  VnToJpMeaningSection,
  VnToJpMeaningSectionRef,
} from "@/modules/home/TranslationSection/VnToJpTab/VnToJpMeaningSection";
import { VnToJpSearch } from "@/modules/home/TranslationSection/VnToJpTab/VnToJpSearch";
import { getRequest } from "@/service/data";
import { useHistoryStore } from "@/store/useHistoryStore";
import { useLexemeStore } from "@/store/useLexemeStore";
import { useVnToJpTransStore } from "@/store/useVnToJpTransStore";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWRImmutable from "swr/immutable";
import { v4 as uuid } from "uuid";
import {
  TranslatedVnToJpParagraph,
  VnToJpParagraphSectionRef,
} from "./VnToJpTab/TranslatedVnToJpParagraph";
import { useEnumQueryState } from "@/hooks/useEnumQueryState";

type Props = {
  _lexemeSearch: TLexeme | undefined;
};

export function TranslationSection({ _lexemeSearch }: Props) {
  const { text, word, selectedVocab, selectedGrammar, setVocabMeaningErrMsg } =
    useLexemeStore();
  const { addHistoryItem } = useHistoryStore();
  const searchVnToJpText = useVnToJpTransStore((state) => state.searchText);

  const [tab, setTab] = useEnumQueryState(
    "tab",
    Object.values(TransTab),
    TransTab.JPToVN
  );

  const [initialLexemeSearch, setInitialLexemeSearch] = useState(_lexemeSearch);
  const [initialLexemeText, setInitialLexemeText] = useState(
    _lexemeSearch?.standard ?? ""
  );

  const jpToVnSearchRef = useRef<JpToVnSearchRef>(null);
  const jpToVnParagraphSectionRef = useRef<JpToVnParagraphSectionRef>(null);
  const vnToJpMeaningSectionRef = useRef<VnToJpMeaningSectionRef>(null);
  const vnToJpParagraphSectionRef = useRef<VnToJpParagraphSectionRef>(null);

  const isVnToJpParagraphMode = searchVnToJpText.length >= PARAGRAPH_MIN_LENGTH;
  const isJpToVnParagraphMode = text.length >= PARAGRAPH_MIN_LENGTH;

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

  const effectiveLexemeSearch = lexemeSearch || initialLexemeSearch;

  const onTranslateParagraph = useCallback(
    () => jpToVnParagraphSectionRef.current?.translateParagraphJpToVn(),
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
              ref={jpToVnSearchRef}
              initialText={initialLexemeText}
              onTranslateParagraph={onTranslateParagraph}
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
                jpToVnSearchRef.current?.hideSuggestions();
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

      {tab === TransTab.VNToJP &&
        (isVnToJpParagraphMode ? (
          <TranslatedVnToJpParagraph ref={vnToJpParagraphSectionRef} />
        ) : (
          <VnToJpMeaningSection ref={vnToJpMeaningSectionRef} />
        ))}

      {tab === TransTab.JPToVN &&
        (isJpToVnParagraphMode ? (
          <TranslatedJpToVnParagraph ref={jpToVnParagraphSectionRef} />
        ) : (
          <JpToVnMeaningSection
            lexemeSearch={effectiveLexemeSearch || selectedVocab}
            loadingLexemeSearch={loadingLexemeSearch}
            retryLexemeSearch={retryLexemeSearch}
            wordIdToReport={
              effectiveLexemeSearch?.id || selectedVocab?.id || ""
            }
          />
        ))}
    </div>
  );
}
