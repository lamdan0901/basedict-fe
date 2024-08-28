import { Home } from "@/modules/home";
import axios from "axios";

type Props = {
  searchParams: { [key: string]: string | undefined };
};

// async function fetchLexemeSearch(
//   search?: string
// ): Promise<TLexeme | undefined> {
//   if (!search) return;

//   try {
//     const res = await axios.get(
//       `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/v1/lexemes/search/` + search
//     );
//     return res.data.data;
//   } catch (err: any) {
//     console.log("err fetchLexemeSearch: ", err);
//   }
// }

export default async function HomePage({ searchParams }: Props) {
  // const { search } = searchParams;
  // const lexemeSearch = await fetchLexemeSearch(search);

  return <Home _lexemeSearch={undefined} />;
}
