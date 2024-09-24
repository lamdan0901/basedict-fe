import { ResolvingMetadata } from "next";
import { Home } from "@/modules/home";
import { cache } from "react";

const fetchLexemeSearch = cache(
  async (search?: string): Promise<TLexeme | undefined> => {
    if (!search) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/v1/lexemes/search/${search}`,
        { next: { revalidate: 86_400 } } // caching for 1 day
      );
      if (!res.ok) return;
      const data = await res.json();
      return data.data;
    } catch (err: any) {
      console.log("err fetchLexemeSearch: ", err);
    }
  }
);

export async function generateMetadata(
  { params }: TComponentProps,
  parent: ResolvingMetadata
) {
  const { lexeme: lexemeSlug } = params;
  const [lexemeSearch, previousMeta] = await Promise.all([
    fetchLexemeSearch(lexemeSlug),
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

export default async function HomePage({ params }: TComponentProps) {
  const lexeme = params.lexeme;
  const lexemeSearch = await fetchLexemeSearch(lexeme);

  return <Home _lexemeSearch={lexemeSearch} />;
}
