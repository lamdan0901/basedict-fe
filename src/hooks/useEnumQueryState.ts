import { useQueryState, parseAsStringEnum } from "nuqs";

export function useEnumQueryState<T extends string>(
  paramName: string,
  enumValues: T[],
  defaultValue: T
) {
  return useQueryState(
    paramName,
    parseAsStringEnum<T>(enumValues).withDefault(defaultValue)
  );
}
