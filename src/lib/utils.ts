import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import QueryString from "qs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stringifyParams(params: Record<string, any>) {
  return QueryString.stringify(params, {
    arrayFormat: "indices",
    allowDots: true,
  });
}

export const trimAllSpaces = (str: string): string => {
  return str.replace(/[\s\u3000]/g, "");
};
