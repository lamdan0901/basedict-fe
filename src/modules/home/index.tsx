"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleCheckBig, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Home() {
  const [text, setText] = useState("");
  const [showExamples, setShowExamples] = useState(false);

  console.log("text: ", text);

  return (
    <div className="flex h-full py-4 sm:flex-row flex-col gap-8 items-center">
      <Tabs defaultValue="vocab" className="w-full h-fit">
        <TabsList className="grid rounded-xl w-[200px] grid-cols-2">
          <TabsTrigger className="rounded-xl" value="vocab">
            Từ vựng
          </TabsTrigger>
          <TabsTrigger className="rounded-xl" value="grammar">
            Ngữ pháp
          </TabsTrigger>
        </TabsList>
        <TabsContent value="vocab">
          <Card className="rounded-2xl h-fit">
            <CardContent className="!p-4">
              <Input
                onKeyDown={(e) => {
                  if (e.key === "Enter") setText(e.currentTarget.value);
                }}
                placeholder="Enter text here..."
                className="border-none px-1 text-xl focus-visible:ring-transparent"
              />
              <div className="w-full h-px bg-muted-foreground "></div>
              <div className="flex flex-col gap-2  h-[400px] overflow-auto items-start mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Button
                    key={i}
                    className="items-start relative px-1 w-full flex-col"
                    variant="ghost"
                  >
                    <span> 解析 (かいせき)</span>
                    <span>Tối thích</span>
                    <div className="w-full h-px bg-muted-foreground absolute -bottom-1 left-0"></div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex mx-4 gap-2 mt-4 flex-wrap">
            <p>Từ tương tự:</p>
            {Array.from({ length: 1 }).map((_, i) => (
              <Badge className="cursor-pointer" key={i}>
                xxx
              </Badge>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="grammar">
          <Card className="rounded-2xl h-[475px] mb-10">
            <CardContent className="!p-4">
              <p>This function is not implemented</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="w-full rounded-2xl min-h-[475px] mt-2">
        <CardContent className="!p-4 space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex gap-1 items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="text-2xl px-1" variant={"ghost"}>
                    Phân tích
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        https://ui.shadcn.com/docs/components/command
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <CircleCheckBig className="text-green-500" />
            </div>

            <div className="flex gap-2 items-center">
              <div className="bg-slate-50 text-black rounded-full px-6 text-sm border">
                IT
              </div>
              <Button className="rounded-full p-2" size="sm" variant="ghost">
                <Flag />
              </Button>
            </div>
          </div>

          <p className="pl-1">
            Từ này thường được dùng để chỉ việc phân tích chi tiết các yếu tố
            của một vấn đề hoặc một hiện tượng nào đó để hiểu rõ hơn về nó.
            Trong các lĩnh vực như khoa học, toán học, hoặc lập trình, 解析 có
            thể liên quan đến việc giải thích các kết quả, phương pháp, hoặc các
            yếu tố cấu thành.
          </p>

          <div>
            <Button
              onClick={() => setShowExamples((prev) => !prev)}
              className="underline text-base px-1"
              variant={"link"}
            >
              {showExamples ? "Ẩn" : "Xem"} ví dụ
            </Button>
            <ol className={cn(showExamples ? "block" : "hidden")}>
              <li>Coffee</li>
              <li>Tea</li>
              <li>Milk</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
