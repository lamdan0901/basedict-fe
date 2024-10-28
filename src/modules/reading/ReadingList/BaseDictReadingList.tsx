import { useQueryParams } from "@/hooks/useQueryParam";
import { stringifyParams } from "@/lib";
import { ReadingType, TabVal } from "@/modules/reading/const";
import { ReadingListContent } from "@/modules/reading/ReadingList/ReadingListContent";
import { getRequest } from "@/service/data";
import { useRef } from "react";
import useSWR from "swr";

type THasReadFilter = {
  hasReadBaseDict: boolean;
  selectedReadingItemId: number | null;
};

type Props = { jlptLevel?: TJlptLevel };

export function BaseDictReadingList({ jlptLevel }: Props) {
  const hasSetInitialReading = useRef(false);

  const [{ hasReadBaseDict, selectedReadingItemId }, setHasReadFilter] =
    useQueryParams<THasReadFilter>({
      hasReadBaseDict: false,
      selectedReadingItemId: null,
    });
  const [readingParams] = useQueryParams({
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
          hasSetInitialReading.current = true;
          if (!selectedReadingItemId) {
            setHasReadFilter({ selectedReadingItemId: data[0].id });
          }
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
