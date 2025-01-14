import { stringifyParams } from "@/lib";
import { ReadingType, TabVal } from "@/modules/reading/const";
import { ReadingListContent } from "@/modules/reading/ReadingList/ReadingListContent";
import { getRequest } from "@/service/data";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { useRef } from "react";
import useSWR from "swr";
import { parseQueryString } from "@/utils/parseQueryString";

type Props = { jlptLevel?: TJlptLevel };

export function BaseDictReadingList({ jlptLevel }: Props) {
  const hasSetInitialReading = useRef(false);

  const [{ hasReadBaseDict, selectedReadingItemId }, setHasReadFilter] =
    useQueryStates({
      hasReadBaseDict: parseAsBoolean.withDefault(false),
      selectedReadingItemId: parseAsInteger,
    });

  const [readingParams] = useQueryStates({
    jlptLevel: parseQueryString(jlptLevel),
    readingType: parseAsStringEnum(Object.values(ReadingType)).withDefault(
      ReadingType.All
    ),
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
