import { readingRepo } from "@/lib/supabase/client";
import { TabVal } from "@/modules/reading/const";
import { ReadingListContent } from "@/modules/reading/ReadingList/ReadingListContent";
import { getRequest } from "@/service/data";
import { parseQueryString } from "@/lib/utils";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { useRef } from "react";
import useSWR from "swr";

type Props = { jlptLevel?: TJlptLevel };

export function JPLTTestReadingList({ jlptLevel }: Props) {
  const hasSetInitialReading = useRef(false);

  const [{ hasReadJLPTTest, selectedReadingItemId }, setHasReadFilter] =
    useQueryStates({
      hasReadJLPTTest: parseAsBoolean.withDefault(false),
      selectedReadingItemId: parseAsInteger,
    });
  const [{ jlptTestLevel, examId }, setReadingParams] = useQueryStates({
    jlptTestLevel: parseQueryString(jlptLevel),
    examId: parseAsString,
  });

  const { data: readingList = [], isLoading } = useSWR<TReadingMaterial[]>(
    examId && jlptTestLevel
      ? `v1/readings/jlpt/${examId}/${jlptTestLevel}`
      : null,
    () =>
      readingRepo.getReadingList({
        source: "JLPT",
        examId: examId!,
        jlptLevel: jlptTestLevel!,
      }),
    {
      onSuccess(data) {
        if (data[0] && !hasSetInitialReading.current) {
          hasSetInitialReading.current = true;
          if (!selectedReadingItemId) {
            setHasReadFilter({ selectedReadingItemId: data[0].id });
          }
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
      examId={examId || undefined}
      tab={TabVal.JLPT}
    />
  );
}
