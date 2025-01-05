import { useQueryParams } from "@/shared/hooks/useQueryParam";
import { stringifyParams } from "@/shared/lib";
import { ReadingType, TabVal } from "@/features/reading/const";
import { ReadingListContent } from "@/features/reading/ReadingList/ReadingListContent";
import { getRequest } from "@/service/data";
import { useRef } from "react";
import useSWR from "swr";

type THasReadFilter = {
  hasReadJLPTTest: boolean;
  selectedReadingItemId: number | null;
};

type TReadingParams = {
  jlptTestLevel: TJlptLevel | undefined;
  examId: string | undefined;
};

type Props = { jlptLevel?: TJlptLevel };

export function JPLTTestReadingList({ jlptLevel }: Props) {
  const hasSetInitialReading = useRef(false);

  const [{ hasReadJLPTTest, selectedReadingItemId }, setHasReadFilter] =
    useQueryParams<THasReadFilter>({
      hasReadJLPTTest: false,
      selectedReadingItemId: null,
    });
  const [{ jlptTestLevel, examId }, setReadingParams] =
    useQueryParams<TReadingParams>({
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
      examId={examId}
      tab={TabVal.JLPT}
    />
  );
}
