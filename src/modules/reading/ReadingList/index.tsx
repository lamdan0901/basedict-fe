import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useQueryParam, useQueryParams } from "@/hooks/useQueryParam";
import { stringifyParams } from "@/lib";
import { ReadingType, TabVal } from "@/modules/reading/const";
import { JLPTReadingDescModal } from "@/modules/reading/ReadingList/JLPTReadingDescModal";
import { ReadingListContent } from "@/modules/reading/ReadingList/ReadingListContent";
import { getRequest } from "@/service/data";
import { useAppStore } from "@/store/useAppStore";
import { useReadingStore } from "@/store/useReadingStore";
import { useRef } from "react";
import useSWR from "swr";

export function ReadingList() {
  const { sheetOpen, setSheetOpen } = useReadingStore();
  const isMdScreen = useMediaQuery("(min-width: 768px)");

  if (isMdScreen) {
    if (sheetOpen) setSheetOpen(false);
    return <InnerReadingList />;
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTitle></SheetTitle>
      <SheetContent aria-describedby={undefined} side="left">
        <InnerReadingList />
      </SheetContent>
    </Sheet>
  );
}

function InnerReadingList() {
  const [tab, setTab] = useQueryParam("tab", TabVal.BaseDict);

  return (
    <div className=" mb-2">
      <JLPTReadingDescModal />
      <Tabs value={tab} onValueChange={(val) => setTab(val as TabVal)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value={TabVal.BaseDict}>BaseDict</TabsTrigger>
          <TabsTrigger value={TabVal.JLPT}>Đề JLPT</TabsTrigger>
        </TabsList>
        <TabsContent value={TabVal.BaseDict}>
          <BaseDictReadingList />
        </TabsContent>
        <TabsContent value={TabVal.JLPT}>
          <JPLTTestReadingList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BaseDictReadingList() {
  const hasSetInitialReading = useRef(false);
  const jlptLevel = useAppStore.getState().profile?.jlptLevel ?? "N3";
  const { hasReadBaseDict, setReadingItemId } = useReadingStore();
  const [readingParams] = useQueryParams({
    jlptLevel,
    readingType: ReadingType.GrammarReading,
  });

  const { data: readingList = [], isLoading } = useSWR<TReadingMaterial[]>(
    `/v1/readings?${stringifyParams(readingParams)}&source=BaseDict`,
    getRequest,
    {
      onSuccess(data) {
        if (data[0] && !hasSetInitialReading.current) {
          setReadingItemId(data[0].id);
          hasSetInitialReading.current = true;
        }
      },
    }
  );

  const filteredReadingList = readingList.filter((reading) => {
    return hasReadBaseDict === reading.isRead;
  });

  return (
    <ReadingListContent
      readingList={filteredReadingList}
      isLoading={isLoading}
      tab={TabVal.BaseDict}
    />
  );
}

function JPLTTestReadingList() {
  const hasSetInitialReading = useRef(false);
  const jlptLevel = useAppStore.getState().profile?.jlptLevel ?? "N3";
  const { hasReadJLPTTest, setReadingItemId } = useReadingStore();
  const [{ jlptTestLevel, examId }, setReadingParams] = useQueryParams<{
    jlptTestLevel: TJlptLevel;
    examId: string | undefined;
  }>({
    jlptTestLevel: jlptLevel,
    examId: undefined,
  });

  const { data: readingList = [], isLoading } = useSWR<TReadingMaterial[]>(
    examId
      ? `/v1/readings?${stringifyParams({
          examId,
          jlptLevel: jlptTestLevel,
        })}&source=JLPT`
      : null,
    getRequest,
    {
      onSuccess(data) {
        if (data[0] && !hasSetInitialReading.current) {
          setReadingItemId(data[0].id);
          hasSetInitialReading.current = true;
        }
      },
    }
  );

  const { data: testPeriods = [], isLoading: isLoadingTestPeriods } = useSWR<
    TTestPeriod[]
  >(`v1/exams/jlpt?jlptLevel=${jlptTestLevel}`, getRequest, {
    onSuccess(data) {
      if (!examId && data.length)
        setReadingParams({ examId: data[0].id.toString() });
    },
  });

  const filteredReadingList = readingList.filter((reading) => {
    return hasReadJLPTTest === reading.isRead;
  });

  return (
    <ReadingListContent
      readingList={filteredReadingList}
      isLoading={isLoading}
      isLoadingTestPeriods={isLoadingTestPeriods}
      testPeriods={testPeriods}
      tab={TabVal.JLPT}
    />
  );
}
