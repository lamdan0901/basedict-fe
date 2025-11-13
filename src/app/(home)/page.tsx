import { ResolvingMetadata } from "next";
import { Home } from "@/modules/home";
import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { createLexemeRepository } from "@/lib/supabase/repositories/lexemeRepo";

const fetchLexemeSearch = cache(
  async (word?: string): Promise<TLexeme | undefined> => {
    if (!word) return;

    try {
      const supabase = createClient();
      const lexemeRepo = createLexemeRepository(supabase);
      const data = await lexemeRepo.searchLexeme(word);
      return data;
    } catch (err: any) {
      if (err === "NOT_FOUND") return;
      console.log("err fetchLexemeSearch: ", err);
    }
  }
);

export async function generateMetadata(
  { searchParams }: TComponentProps,
  parent: ResolvingMetadata
) {
  const [lexemeSearch, previousMeta] = await Promise.all([
    fetchLexemeSearch(searchParams.word),
    parent,
  ]);

  if (!lexemeSearch) return previousMeta;

  const { lexeme, standard, meaning, hanviet, hiragana } = lexemeSearch;
  const _lexeme = lexeme !== standard ? ` ${lexeme}` : "";

  return {
    ...previousMeta,
    title: `${standard}${_lexeme} ${hiragana} nghĩa là gì? dịch nghĩa, giải nghĩa, ví dụ, từ tương tự | Basedict`,
    description: `Định nghĩa của ${standard}${_lexeme} (${hiragana}) ${hanviet} : ${meaning[0].meaning} | và cả các ý nghĩa khác nữa. Tra cứu dịch nghĩa, giải nghĩa, cách sử dụng và các ví dụ thực tế tại BaseDict, từ điển tiếng nhật tốt nhất Việt Nam`,
    keywords: `${standard}, ${_lexeme}, ${hiragana}, ${meaning[0].meaning}, từ điển nhật việt, ý nghĩa, dịch nghĩa, giải nghĩa, ví dụ, basedict`,
  };
}

export default async function HomePage({ searchParams }: TComponentProps) {
  const lexemeSearch = await fetchLexemeSearch(searchParams.word);

  return <Home _lexemeSearch={lexemeSearch} />;
}
