import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useQueryParam, useQueryParams } from "@/hooks/useQueryParam";
import { stringifyParams } from "@/lib";
import { ReadingType, TabVal } from "@/modules/reading/const";
import { JLPTReadingDescModal } from "@/modules/reading/ReadingList/JLPTReadingDescModal";
import { ReadingListContent } from "@/modules/reading/ReadingList/ReadingListContent";
import { getRequest } from "@/service/data";
import { fetchUserProfile } from "@/service/user";
import { useReadingStore } from "@/store/useReadingStore";
import { useEffect, useRef } from "react";
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

  const { data: user, isLoading } = useSWR<TUser>("get-user", fetchUserProfile);
  const jlptLevel = isLoading ? undefined : user?.jlptLevel || "N3";

  return (
    <div className=" mb-2">
      <JLPTReadingDescModal />
      <Tabs value={tab} onValueChange={(val) => setTab(val as TabVal)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value={TabVal.BaseDict}>BaseDict</TabsTrigger>
          <TabsTrigger value={TabVal.JLPT}>Đề JLPT</TabsTrigger>
        </TabsList>
        <TabsContent value={TabVal.BaseDict}>
          <BaseDictReadingList jlptLevel={jlptLevel} />
        </TabsContent>
        <TabsContent value={TabVal.JLPT}>
          <JPLTTestReadingList jlptLevel={jlptLevel} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BaseDictReadingList({ jlptLevel }: { jlptLevel?: TJlptLevel }) {
  const hasSetInitialReading = useRef(false);
  const { hasReadBaseDict, setReadingItemId } = useReadingStore();
  const [readingParams, setReadingParams] = useQueryParams({
    jlptLevel,
    readingType: ReadingType.All,
  });

  const { data: readingList = [], isLoading } = useSWR<TReadingMaterial[]>(
    readingParams.jlptLevel
      ? `/v1/readings?${stringifyParams({
          source: "BaseDict",
          jlptLevel: readingParams.jlptLevel,
          readingType:
            readingParams.readingType !== "all"
              ? readingParams.readingType
              : undefined,
        })}`
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

  const filteredReadingList = readingList.filter((reading) => {
    return hasReadBaseDict === reading.isRead;
  });

  return (
    <ReadingListContent
      readingList={filteredReadingList}
      isLoading={isLoading}
      tab={TabVal.BaseDict}
      {...readingParams}
    />
  );
}

function JPLTTestReadingList({ jlptLevel }: { jlptLevel?: TJlptLevel }) {
  const hasSetInitialReading = useRef(false);
  const { hasReadJLPTTest, setReadingItemId } = useReadingStore();
  const [{ jlptTestLevel, examId }, setReadingParams] = useQueryParams<{
    jlptTestLevel: TJlptLevel | undefined;
    examId: string | undefined;
  }>({
    jlptTestLevel: jlptLevel,
    examId: undefined,
  });

  const { data: readingList = [], isLoading } = useSWR<TReadingMaterial[]>(
    examId && jlptTestLevel
      ? `/v1/readings?${stringifyParams({
          source: "JLPT",
          examId,
          jlptLevel: jlptTestLevel,
        })}`
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
  >(
    jlptTestLevel ? `v1/exams/jlpt?jlptLevel=${jlptTestLevel}` : null,
    getRequest,
    {
      onSuccess(data) {
        if (!examId && data.length)
          setReadingParams({ examId: data[0].id.toString() });
      },
    }
  );

  const filteredReadingList = readingList.filter((reading) => {
    return hasReadJLPTTest === reading.isRead;
  });

  return (
    <ReadingListContent
      readingList={filteredReadingList}
      isLoading={isLoading}
      isLoadingTestPeriods={isLoadingTestPeriods}
      testPeriods={testPeriods}
      jlptTestLevel={jlptTestLevel}
      examId={examId}
      tab={TabVal.JLPT}
    />
  );
}
