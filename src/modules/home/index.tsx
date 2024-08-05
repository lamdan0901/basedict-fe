"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";
import { cn, stringifyParams } from "@/lib/utils";
import { getRequest } from "@/service/data";
import { CircleCheckBig, Flag } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import useSWR from "swr";

const MAX_LINES = 3;

export function Home() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const setSearchParam = useUrlSearchParams();
  const [text, setText] = useState(search);
  const [word, setWord] = useState("");

  const [selectedLexeme, setSelectedLexeme] = useState<TLexeme | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [readyToSearch, setReadyToSearch] = useState(false);

  const [meaningIndex, setMeaningIndex] = useState(0);
  const [meaningSelectorOpen, setMeaningSelectorOpen] = useState(false);
  const [meaningNotExisted, setMeaningNotExisted] = useState(false);

  const {
    data: lexemeListRes,
    isLoading: loadingLexemeList,
    mutate,
  } = useSWR<{
    data: TLexeme[];
  }>(
    search
      ? `/v1/lexemes?${stringifyParams({
          search,
          sort: "frequency_ranking",
          orderDirection: "asc",
        })}`
      : null,
    getRequest
  );
  const {
    data: lexemeSearch,
    isLoading: loadingLexemeSearch,
    error: lexemeSearchError,
  } = useSWR<TLexeme>(word ? `/v1/lexemes/search/${word}` : null, getRequest);
  const { data: lexemeSearchGPT, isLoading: loadingLexemeSearchGPT } =
    useSWR<TLexeme>(
      meaningNotExisted && word ? `/lexemes/v1/${word}` : null,
      getRequest
    );

  const lexemeList = lexemeListRes?.data ?? [];
  const lexemeSearchToDisplay = lexemeSearch?.meaning?.[0]
    ? lexemeSearch
    : lexemeSearchGPT;

  const hanviet = selectedLexeme?.hanviet
    ? "(" + selectedLexeme.hanviet + ")"
    : "";
  const lexemeToShowHanviet = selectedLexeme || lexemeSearchToDisplay;
  const lexemeHanViet = lexemeToShowHanviet
    ? lexemeToShowHanviet.standard === lexemeToShowHanviet.lexeme
      ? `${lexemeToShowHanviet.hiragana} ${hanviet}`
      : `${lexemeToShowHanviet.hiragana} ${lexemeToShowHanviet.lexeme} ${hanviet}`
    : "";

  useEffect(() => {
    if (readyToSearch) {
      setSearchParam({ search: text });
      setReadyToSearch(false);
    }
  }, [setSearchParam, text, readyToSearch]);

  // useEffect(() => {
  //   console.log("lexemeSearchError", lexemeSearchError);
  //   // if (!lexemeSearch?.meaning?.[0] && meaningNotExisted)
  //   //   setMeaningNotExisted(true);
  // }, [lexemeSearchError]);

  console.log("render...");

  return (
    <div className="flex h-full py-4 sm:flex-row flex-col gap-8 items-center">
      <Tabs defaultValue="vocab" className="w-full h-fit  relative -top-5">
        <TabsList className="grid rounded-xl w-[200px] grid-cols-2">
          <TabsTrigger className="rounded-xl" value="vocab">
            Từ vựng
          </TabsTrigger>
          <TabsTrigger className="rounded-xl" value="grammar">
            Ngữ pháp
          </TabsTrigger>
        </TabsList>
        <TabsContent className="relative" value="vocab">
          <Card className="rounded-2xl h-fit">
            <CardContent className="!p-4  h-[325px]">
              <Input
                value={text}
                autoFocus
                type="search"
                onChange={(e) => {
                  setText(e.target.value);
                  setSearchParam({ search: e.target.value });
                  if (selectedLexeme) setSelectedLexeme(null);
                  if (e.target.value.trim().length === 0) {
                    setSearchParam({ search: "" });
                    mutate({ data: [] });
                    setWord("");
                  }
                }}
                onClick={() => {
                  if (!readyToSearch) setReadyToSearch(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && text) {
                    setMeaningNotExisted(false);
                    setWord(text);
                  }
                }}
                placeholder="Enter text here..."
                className="border-none px-1 text-3xl focus-visible:ring-transparent"
              />
              {lexemeHanViet}
              {lexemeList.length > 0 && (
                <div className="w-full h-px bg-muted-foreground "></div>
              )}
              <div className="flex flex-col gap-6 overflow-auto h-[220px] items-start mt-3">
                {loadingLexemeList
                  ? "Searching..."
                  : lexemeList.map((lexeme) => {
                      const lexemeStandard =
                        lexeme.standard === lexeme.lexeme
                          ? lexeme.standard
                          : `${lexeme.standard} ${lexeme.lexeme}`;
                      return (
                        <Button
                          key={lexeme.id}
                          onClick={() => {
                            setSelectedLexeme(lexeme);
                            setSearchParam({ search: "" });
                            setText(lexemeStandard);
                            setWord(lexeme.lexeme);
                            mutate({ data: [] });
                          }}
                          className="items-start text-xl py-7 font-normal relative px-1 w-full flex-col"
                          variant="ghost"
                        >
                          <span>
                            {lexemeStandard}{" "}
                            {lexeme.hiragana ? `(${lexeme.hiragana})` : ""}
                          </span>
                          <span>{lexeme.hanviet}</span>
                          <div className="w-full h-px bg-muted-foreground absolute -bottom-2 left-0"></div>
                        </Button>
                      );
                    })}
              </div>
            </CardContent>
          </Card>

          <div className="flex mx-4 gap-2 mt-4 absolute top-[100%] left-0 flex-wrap">
            <p>Từ tương tự:</p>
            {lexemeToShowHanviet?.similars?.map((word, i) => (
              <Badge
                className="cursor-pointer"
                onClick={() => {
                  setSearchParam({ search: word });
                  setSelectedLexeme(null);
                  setText(word);
                  setWord(word);
                }}
                key={i}
              >
                {word}
              </Badge>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="grammar">
          <Card className="rounded-2xl h-[325px] mb-10">
            <CardContent className="!p-4">
              <p>This function is not implemented</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="w-full rounded-2xl min-h-[325px] mt-2">
        <CardContent className="!p-4 space-y-2">
          {(loadingLexemeSearch || loadingLexemeSearchGPT) && "Loading..."}
          {lexemeSearchToDisplay && (
            <Fragment>
              <div className="flex justify-between items-center">
                <div className="flex gap-1 items-center">
                  <Popover
                    open={meaningSelectorOpen}
                    onOpenChange={setMeaningSelectorOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button className="text-2xl px-1" variant={"ghost"}>
                        {lexemeSearchToDisplay.meaning[meaningIndex].meaning}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit min-w-40 px-0">
                      <Command className="p-0">
                        <CommandList>
                          {lexemeSearchToDisplay.meaning.map((m, i) => (
                            <CommandItem
                              key={i}
                              className="text-xl"
                              onSelect={() => {
                                setMeaningIndex(i);
                                setMeaningSelectorOpen(false);
                              }}
                            >
                              {m.meaning}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {lexemeSearchToDisplay.approved && (
                    <CircleCheckBig className="text-green-500 w-4 h-4 mb-1" />
                  )}
                </div>

                <div className="flex gap-2 items-center">
                  <div className="bg-slate-50 text-black rounded-full px-6 text-sm border">
                    {lexemeSearchToDisplay.meaning[meaningIndex].context}
                  </div>
                  <Button
                    className="rounded-full p-2"
                    size="sm"
                    variant="ghost"
                  >
                    <Flag className=" w-5 h-5" />
                  </Button>
                </div>
              </div>

              <p className="pl-1">
                {lexemeSearchToDisplay.meaning[meaningIndex].explaination}
              </p>

              {lexemeSearchToDisplay.meaning[meaningIndex].example && (
                <div>
                  <Button
                    onClick={() => setShowExamples((prev) => !prev)}
                    className="underline text-base px-1"
                    variant={"link"}
                  >
                    {showExamples ? "Ẩn" : "Xem"} ví dụ
                  </Button>
                  <p
                    className={cn(
                      "whitespace-pre-line",
                      showExamples ? "block" : "hidden"
                    )}
                  >
                    {lexemeSearchToDisplay.meaning[meaningIndex].example}
                  </p>
                </div>
              )}
            </Fragment>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
