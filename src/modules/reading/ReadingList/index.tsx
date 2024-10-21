import { AdSense } from "@/components/Ad/Ad";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useQueryParam } from "@/hooks/useQueryParam";
import { TabVal } from "@/modules/reading/const";
import { BaseDictReadingList } from "@/modules/reading/ReadingList/BaseDictReadingList";
import { JLPTReadingDescModal } from "@/modules/reading/ReadingList/JLPTReadingDescModal";
import { JPLTTestReadingList } from "@/modules/reading/ReadingList/JPLTTestReadingList";
import { useAppStore } from "@/store/useAppStore";
import { useReadingStore } from "@/store/useReadingStore";
import { shallow } from "zustand/shallow";

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
