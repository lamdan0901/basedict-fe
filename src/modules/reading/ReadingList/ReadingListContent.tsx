import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ReadingItem } from "@/modules/reading/ReadingList/ReadingItem";
import { ReadingType, readingTypeMap, TabVal } from "@/modules/reading/const";
import { jlptLevels } from "@/constants";
import { useQueryParams } from "@/hooks/useQueryParam";
import { useAppStore } from "@/store/useAppStore";
import { useReadingStore } from "@/store/useReadingStore";

type Props = {
  readingList: TReadingMaterial[];
  isLoading: boolean;
  tab: TabVal;
} & (
  | {
      tab: TabVal.BaseDict;
      testPeriods?: undefined;
      isLoadingTestPeriods?: undefined;
    }
  | {
      tab: TabVal.JLPT;
      testPeriods: TTestPeriod[];
      isLoadingTestPeriods?: boolean;
    }
);

export function ReadingListContent({
  readingList,
  isLoading,
  isLoadingTestPeriods,
  testPeriods,
  tab,
}: Props) {
  const {
    hasReadBaseDict,
    setHasReadBaseDict,
    hasReadJLPTTest,
    setHasReadJLPTTest,
  } = useReadingStore();
  const jlptLevel = useAppStore.getState().profile?.jlptLevel ?? "N3";
  const [readingParams, setReadingParams] = useQueryParams({
    jlptLevel,
    jlptTestLevel: jlptLevel,
    readingType: ReadingType.All,
    examId: "1",
  });

  const isBaseDictTab = tab === TabVal.BaseDict;

  return (
    <Card className="w-full md:w-[280px] lg:w-[320px] rounded-2xl">
      <CardContent className="py-4">
        <div className="space-y-4 mb-4">
          <div className="flex items-center justify-start">
            <p className="basis-[80px] shrink-0">Cấp</p>
            <Select
              value={
                isBaseDictTab
                  ? readingParams.jlptLevel
                  : readingParams.jlptTestLevel
              }
              onValueChange={(value) => {
                setReadingParams({
                  [isBaseDictTab ? "jlptLevel" : "jlptTestLevel"]:
                    value as TJlptLevel,
                  ...(!isBaseDictTab && { examId: undefined }),
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="" />
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
            <p className="basis-[80px] shrink-0">
              {isBaseDictTab ? "Dạng bài" : "Đề thi"}
            </p>
            {isBaseDictTab ? (
              <Select
                value={readingParams.readingType}
                onValueChange={(value) =>
                  setReadingParams({ readingType: value as ReadingType })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(readingTypeMap).map(([type, title]) => (
                    <SelectItem key={type} value={type}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Select
                disabled={isLoadingTestPeriods}
                value={readingParams.examId}
                onValueChange={(value) => setReadingParams({ examId: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn đề thi" />
                </SelectTrigger>
                <SelectContent>
                  {testPeriods.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="flex items-center justify-start">
            <p className="basis-[80px] shrink-0">Đã đọc</p>{" "}
            <Switch
              onCheckedChange={(value) => {
                isBaseDictTab
                  ? setHasReadBaseDict(value)
                  : setHasReadJLPTTest(value);
              }}
              checked={isBaseDictTab ? hasReadBaseDict : hasReadJLPTTest}
              id="isRead"
            />
          </div>
        </div>

        <div className="w-full h-px bg-muted-foreground"></div>

        <div className="mt-1">
          {isLoading
            ? "Đang tải các bài đọc..."
            : readingList.length === 0
            ? "Không có bài đọc nào"
            : null}
        </div>

        <div className="mt-1 max-h-[515px] overflow-auto space-y-1">
          {readingList.map((reading) => (
            <ReadingItem key={reading.id} {...reading} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
