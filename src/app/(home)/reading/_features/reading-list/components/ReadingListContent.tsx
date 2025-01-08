import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ReadingItem } from "../components/ReadingItem";
import {
  ReadingType,
  readingTypeMap,
  TabVal,
} from "@/app/(home)/reading/const";
import { jlptLevels } from "@/shared/constants";
import { useQueryParams } from "@/shared/hooks/useQueryParam";

type Props = {
  readingList: TReadingMaterial[];
  isLoading: boolean;
  tab: TabVal;
} & (
  | {
      tab: TabVal.BaseDict;
      jlptLevel: TJlptLevel | undefined;
      testPeriods?: undefined;
      isLoadingTestPeriods?: undefined;
      jlptTestLevel?: undefined;
      examId?: undefined;
    }
  | {
      tab: TabVal.JLPT;
      testPeriods: TTestPeriod[];
      isLoadingTestPeriods?: boolean;
      jlptTestLevel: TJlptLevel | undefined;
      examId: string | undefined;
      jlptLevel?: undefined;
    }
);

export function ReadingListContent({
  readingList,
  isLoading,
  isLoadingTestPeriods,
  testPeriods,
  tab,
  jlptTestLevel,
  jlptLevel,
  examId,
}: Props) {
  const [{ hasReadBaseDict, hasReadJLPTTest }, setHasReadFilter] =
    useQueryParams({
      hasReadBaseDict: false,
      hasReadJLPTTest: false,
    });
  const [readingParams, setReadingParams] = useQueryParams({
    jlptLevel,
    jlptTestLevel,
    readingType: ReadingType.All,
    examId,
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
                setHasReadFilter({
                  [isBaseDictTab ? "hasReadBaseDict" : "hasReadJLPTTest"]:
                    value,
                });
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
