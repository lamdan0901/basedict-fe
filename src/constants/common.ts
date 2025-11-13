export const MEANING_ERR_MSG: Record<string, string> = {
  NOT_FOUND: "Không tìm thấy từ",
  VALIDATION_FAILED:
    "Từ vựng chỉ được bao gồm hán tự, hiragana hoặc katakana và tối đa là 10 kí tự",
  ENDING_WITH_FORBIDDEN: "Không được kết thúc bằng các từ không được phép",
  UNKNOWN: "Đã xảy ra lỗi không xác định",
};

export const MAX_HISTORY_ITEMS = 50;
export const MAX_FAVORITE_ITEMS = 100;
export const DEFAULT_AVATAR_URL = "/default-avatar.svg";
export const VIP_USER = "vipuser";

export enum HistoryItemType {
  Lexeme,
  Grammar,
  Paragraph,
}
export const JLPT_LEVELS = ["N1", "N2", "N3", "N4", "N5"] as const;
export const jlptLevels: { title: TJlptLevel; value: TJlptLevel }[] = [
  {
    title: "N1",
    value: "N1",
  },
  {
    title: "N2",
    value: "N2",
  },
  {
    title: "N3",
    value: "N3",
  },
  {
    title: "N4",
    value: "N4",
  },
  {
    title: "N5",
    value: "N5",
  },
];
