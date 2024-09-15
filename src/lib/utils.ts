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

export function getLocalStorageItem(key: string, initialValue: any) {
  if (typeof window === "undefined") {
    return initialValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return initialValue;
  }
}

export function formatSecToMinute(sec: number) {
  const mins = Math.floor(sec / 60);
  const secs = sec % 60 < 10 ? `0${sec % 60}` : sec % 60;
  return `${mins}:${secs}`;
}

export const scrollToTop = (id: string) => {
  const topEl = document.querySelector(id);
  topEl?.scrollIntoView({ behavior: "smooth", block: "end" });
};
