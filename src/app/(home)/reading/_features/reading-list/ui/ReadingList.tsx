"use client";

import { AdSense } from "@/components/ui/ad";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { useQueryParam } from "@/shared/hooks/useQueryParam";
import { TabVal } from "@/app/(home)/reading/const";
import { useAppStore } from "@/store/useAppStore";
import { useReadingStore } from "@/app/(home)/reading/_model/store";
import { shallow } from "zustand/shallow";
import { JLPTReadingDescModal } from "../entities/jlpt-reading-desc-modal/ui/JLPTReadingDescModal";
import { BaseDictReadingList } from "../entities/base-dict-reading-list/ui/BaseDictReadingList";
import { JPLTTestReadingList } from "../entities/jplt-test-reading-list/ui/JPLTTestReadingList";

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
      <SheetContent
        className="bg-gray-50"
        aria-describedby={undefined}
        side="left"
      >
        <InnerReadingList />
      </SheetContent>
    </Sheet>
  );
}

function InnerReadingList() {
  const [tab, setTab] = useQueryParam("tab", TabVal.BaseDict);

  const { profileJlptLevel, isLoading } = useAppStore(
    (state) => ({
      profileJlptLevel: state.profile?.jlptLevel,
      isLoading: state.isLoading,
    }),
    shallow
  );
  const jlptLevel = isLoading ? undefined : profileJlptLevel || "N3";

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
      <div className="hidden mt-4 w-full lg:block">
        <AdSense slot="vertical" />
      </div>
    </div>
  );
}
