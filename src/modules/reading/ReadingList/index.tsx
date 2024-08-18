import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useQueryParams } from "@/hooks/useQueryParam";
import { stringifyParams } from "@/lib";
import { jlptLevels, readingTypes } from "@/modules/reading/const";
import { JLPTReadingDescModal } from "@/modules/reading/ReadingList/JLPTReadingDescModal";
import { ReadingItem } from "@/modules/reading/ReadingList/ReadingItem";
import { getRequest } from "@/service/data";
import useSWR from "swr";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useReadingStore } from "@/store/useReadingStore";

export function ReadingList() {
  const { sheetOpen, setSheetOpen } = useReadingStore();
  const isMdScreen = useMediaQuery("(min-width: 768px)");

  if (isMdScreen) {
    if (sheetOpen) setSheetOpen(false);
    return <InnerReadingList />;
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent side="left">
        <InnerReadingList />
      </SheetContent>
    </Sheet>
  );
}

function InnerReadingList() {
  const { searchText, setSearchText, hasRead, setHasRead } = useReadingStore();
  const [readingParams, setReadingParams] = useQueryParams({
    jlptLevel: "N1",
    readingType: 1,
  });

  const { data: readingList = [], isLoading } = useSWR<TReadingMaterial[]>(
    `/v1/readings?${stringifyParams(readingParams)}`,
    getRequest
  );

  const filteredReadingList = readingList.filter((reading) => {
    const isMatchSearchText = reading.title
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const isMatchHasRead = hasRead === reading.isRead;
    return isMatchSearchText && isMatchHasRead;
  });

  return (
    <div className=" mb-2">
      <JLPTReadingDescModal />

      <Card className="w-full md:w-[280px] lg:w-[320px] rounded-2xl">
        <CardContent className="py-4">
          <div className="space-y-4 mb-4">
            <div className="flex items-center justify-start">
              <p className="basis-[80px] shrink-0">Cấp</p>
              <Select
                value={readingParams.jlptLevel}
                onValueChange={(value) =>
                  setReadingParams({ jlptLevel: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a level" />
                </SelectTrigger>
                <SelectContent>
                  {jlptLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-start">
              <p className="basis-[80px] shrink-0">Dạng bài</p>
              <Select
                value={readingParams.readingType.toString()}
                onValueChange={(value) =>
                  setReadingParams({ readingType: +value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  {readingTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value.toString()}>
                      {type.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-start">
              <p className="basis-[80px] shrink-0">Đã đọc</p>{" "}
              <Switch
                onCheckedChange={(value) => setHasRead(value)}
                checked={hasRead}
                id="isRead"
              />
            </div>
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              type="search"
              placeholder="Tìm bài đọc theo tên"
            />
          </div>

          <div className="w-full h-px bg-muted-foreground"></div>

          <div className="mt-1">
            {isLoading
              ? "Đang tải các bài đọc..."
              : readingList.length === 0
              ? "Không có bài đọc nào"
              : null}
          </div>

          {/* TODO: click on item to scroll top  */}
          <div className="mt-1 max-h-[515px] overflow-auto space-y-1">
            {filteredReadingList.map((reading) => (
              <ReadingItem key={reading.id} {...reading} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* <Button
        variant={"link"}
        className="font-semibold block text-blue-500 mx-auto text-base"
      >
        Xem thêm
      </Button> */}
    </div>
  );
}
