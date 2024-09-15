type TMeaning = {
  meaning: string;
  context: string;
  explaination: string;
  example: string;
};

type TLexeme = {
  meaning: TMeaning[];
  id: string;
  lexeme: string;
  standard: string;
  part_of_speech: string[];
  similars: string[];
  hiragana: string;
  hanviet: string;
  is_master: boolean;
  approved: boolean;
  approved_at: string | null;
  old_jlpt_level: number;
  frequency_ranking: number;
  word_origin: string;
  hiragana2: string;
};

type TGrammar = {
  id: string;
  grammar: string;
  meaning: string;
  structure: string;
  summary: string;
  detail: string;
  jlptLevel: string;
  similars: string[];
};
