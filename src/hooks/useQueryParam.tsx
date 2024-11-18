import { useSearchParams, usePathname } from "next/navigation";
import JSURL from "jsurl";
import { useRouter } from "nextjs-toploader/app";
import { omit, pick } from "lodash";

// Utility Types
type QueryValues = Record<string, any>;
type SetQueryValuesOptions = { replace?: boolean };
type UseQValuesOptions = { scroll?: boolean };
type UseQueryParamOptions = {
  replaceAll?: boolean;
  resetPage?: boolean;
  scroll?: boolean;
};
type UseQueryParamsOptions = UseQueryParamOptions;
type QueryParamsWithPage = QueryValues & { page?: number };

export function useQValues(
  name: string = "q",
  options: UseQValuesOptions = {}
): [QueryValues, (obj: QueryValues, option?: SetQueryValuesOptions) => void] {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const queryValues = JSURL.tryParse(searchParams.get(name) || "") || {};
  const setQueryValues = (
    obj: QueryValues,
    option: SetQueryValuesOptions = {}
  ) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set(name, JSURL.stringify(obj));

    const url = `${pathname}?${newSearchParams.toString()}`;

    if (option.replace) {
      router.replace(url, { scroll: options.scroll });
    } else {
      router.push(url, { scroll: options.scroll });
    }
  };

  return [queryValues, setQueryValues];
}

export function useQueryParam<T>(
  name: string,
  defaultValue?: T,
  options?: UseQueryParamOptions
): [
  T | undefined,
  (value: T | undefined, setValueOption?: SetQueryValuesOptions) => void,
  { name: string; defaultValue?: T }
] {
  const [queryValues, setQueryValues] = useQValues("q", {
    scroll: options?.scroll,
  });

  const value: T | undefined =
    queryValues[name] !== undefined ? queryValues[name] : defaultValue;
  const setValue = (
    value: T | undefined,
    setValueOption?: SetQueryValuesOptions
  ) => {
    let newQueryValues: QueryParamsWithPage = {
      ...queryValues,
      [name]: value,
    };

    if (options?.replaceAll) {
      newQueryValues = { [name]: value };
    }
    if (value === undefined) {
      newQueryValues = { ...omit(queryValues, name) };
    }
    if (options?.resetPage) {
      newQueryValues.page = 1;
    }

    setQueryValues(newQueryValues, setValueOption);
  };

  return [value, setValue, { name, defaultValue }];
}

export function useQueryParams<T extends QueryParamsWithPage>(
  paramObj: T,
  options?: UseQueryParamsOptions
): [
  T,
  (value: Partial<T>, setValueOption?: SetQueryValuesOptions) => void,
  { defaultValue: T }
] {
  const [queryValues, setQueryValues] = useQValues("q", {
    scroll: options?.scroll,
  });

  const value = {
    ...paramObj,
    ...pick(queryValues, Object.keys(paramObj)),
  } as T;

  const setValue = (
    newValue: Partial<T>,
    setValueOption?: SetQueryValuesOptions
  ) => {
    let newQueryValues = options?.replaceAll
      ? newValue
      : { ...queryValues, ...newValue };
    if (options?.resetPage) {
      newQueryValues.page = 1;
    }
    setQueryValues(newQueryValues, setValueOption);
  };

  return [value, setValue, { defaultValue: paramObj }];
}
