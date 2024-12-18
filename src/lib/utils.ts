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

export function shuffleArray<T>(arr: T[]): T[] {
  const shuffledArr = structuredClone(arr);

  for (let i = shuffledArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]];
  }

  return shuffledArr;
}

export function formatQuizNFlashcardSearchParams(
  params: {
    search?: string;
    sort?: string;
    tagName?: string;
    jlptLevel?: string;
    offset?: number;
    limit?: number;
  },
  shouldSearchByTag: boolean
) {
  const clonedParams = structuredClone(params);
  if (shouldSearchByTag) {
    clonedParams.tagName = clonedParams.search?.slice(1);
    delete clonedParams.search;
  } else {
    delete clonedParams.tagName;
  }

  return clonedParams;
}
