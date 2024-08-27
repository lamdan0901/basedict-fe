import React from "react";
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
import {
  jlptLevels,
  readingTypes,
  TabVal,
  testPeriods,
} from "@/modules/reading/const";
import { useQueryParams } from "@/hooks/useQueryParam";
import { useAppStore } from "@/store/useAppStore";
import { useReadingStore } from "@/store/useReadingStore";

type Props = {
  readingList: TReadingMaterial[];
  isLoading: boolean;
  tab: TabVal;
};

export function ReadingListContent({ readingList, isLoading, tab }: Props) {
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
    readingType: 1,
    examCode: "1",
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
              onValueChange={(value) =>
                setReadingParams({
                  [isBaseDictTab ? "jlptLevel" : "jlptTestLevel"]:
                    value as TJlptLevel,
                })
              }
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
                value={readingParams.readingType.toString()}
                onValueChange={(value) =>
                  setReadingParams({ readingType: +value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  {readingTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value.toString()}>
                      {type.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Select
                value={readingParams.examCode}
                onValueChange={(value) => setReadingParams({ examCode: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent className="w-[100px]">
                  {testPeriods.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
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