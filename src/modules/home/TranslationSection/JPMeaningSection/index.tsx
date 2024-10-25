import useSWR from "swr";
import { getRequest, postRequest } from "@/service/data";
import useSWRMutation from "swr/mutation";
import { forwardRef, useImperativeHandle } from "react";
import { useQueryParam } from "@/hooks/useQueryParam";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib";

export const JPMeaningSection = forwardRef((props, ref) => {
  // const { data: lexemeSearchRes, isLoading: loadingLexemeSearchRes } = useSWR<{
  //   data: TLexeme[];
  // }>(getRequest);
  const [searchParam] = useQueryParam("searchVietnamese", "");
  const { trigger: translateJPToVNTrigger, isMutating } = useSWRMutation(
    `v1/lexemes/vietnamese/${searchParam}`,
    (url, _) => getRequest(url)
  );

  useImperativeHandle(
    ref,
    () => ({
      translateJPToVN: () => translateJPToVNTrigger(),
    }),
    [translateJPToVNTrigger]
  );

  return (
    <Card
      className={cn(
        "w-full rounded-2xl sm:min-h-[328px] h-fit relative "
        // !lexemeSearch && "min-h-[328px]"
      )}
    >
      <CardContent className="!p-4 !pb-10 space-y-2">xxx</CardContent>
    </Card>
  );
});
