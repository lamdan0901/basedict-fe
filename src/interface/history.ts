import { HistoryItemType } from "@/shared/constants";

export type TFavoriteItem =
  | (TLexeme & { type: HistoryItemType.Lexeme; uid: string })
  | (TGrammar & { type: HistoryItemType.Grammar; uid: string });

export type THistoryItem =
  | TFavoriteItem
  | {
      rawParagraph: string;
      translatedParagraph: string;
      type: HistoryItemType.Paragraph;
      uid: string;
    };
