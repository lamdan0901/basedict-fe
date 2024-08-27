import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useQueryParam, useQueryParams } from "@/hooks/useQueryParam";
import { stringifyParams } from "@/lib";
import { jlptLevels, readingTypes, TabVal } from "@/modules/reading/const";
import { JLPTReadingDescModal } from "@/modules/reading/ReadingList/JLPTReadingDescModal";
import { ReadingItem } from "@/modules/reading/ReadingList/ReadingItem";
import { getRequest } from "@/service/data";
import useSWR from "swr";
import { Sheet, SheetTitle, SheetContent } from "@/components/ui/sheet";
import { useReadingStore } from "@/store/useReadingStore";
import { useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReadingListContent } from "@/modules/reading/ReadingList/ReadingListContent";

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
        <TabsContent value={TabVal.JLPT}></TabsContent>
      </Tabs>
    </div>
  );
}

// TODO: hasRead of basedict n jlpt tests are different -> more props for jlpt tests

function BaseDictReadingList() {
  const hasSetInitialReading = useRef(false);
  const jlptLevel = useAppStore.getState().profile?.jlptLevel ?? "N3";
  const { hasRead, setReadingItemId } = useReadingStore();
  const [readingParams] = useQueryParams({
    jlptLevel,
    readingType: 1,
  });

  const { data: readingList = [], isLoading } = useSWR<TReadingMaterial[]>(
    `/v1/readings?${stringifyParams(readingParams)}&isJlpt=false`,
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
    return hasRead === reading.isRead;
  });

  return (
    <ReadingListContent
      readingList={filteredReadingList}
      isLoading={isLoading}
      tab={TabVal.BaseDict}
    />
  );
}
