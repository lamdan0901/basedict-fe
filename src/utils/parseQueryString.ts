import { createParser, parseAsStringEnum, ParserBuilder } from "nuqs";

export function parseQueryString<T extends string>(
  defaultValue: T | null | undefined
) {
  return createParser<T>({
    parse: (value) => value as T,
    serialize: (value) => value,
  }).withDefault(defaultValue as NonNullable<T>);
}
