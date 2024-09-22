"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { jlptLevels } from "@/constants";
import { cn } from "@/lib";
import { fetchUserProfile } from "@/service/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

export function LevelSelector() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState("N3");

  const { data, isLoading } = useSWR<TUser>("get-user", fetchUserProfile);

  useEffect(() => {
    setSelectedLevel(data?.jlptLevel || "N3");
  }, [data?.jlptLevel]);

  return (
    <div>
      <p className="mb-4 text-sm">Hãy chọn cấp độ bộ đề luyện thi</p>
      <RadioGroup
        value={selectedLevel}
        onValueChange={setSelectedLevel}
        className="flex gap-3 justify-center flex-wrap"
      >
        {jlptLevels.map(({ value }) => {
          const isSelected = selectedLevel === value;
          return (
            <div key={value} className={cn("flex items-center space-x-2")}>
              <RadioGroupItem
                className="text-inherit"
                value={value}
                id={value}
                hidden
              />
              <Label className={"cursor-pointer"} htmlFor={value}>
                <Badge
                  className="w-24 h-9 text-base justify-center"
                  variant={isSelected ? "default" : "outline"}
                >
                  {value}
                </Badge>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
      <Button
        disabled={isLoading}
        onClick={() => router.push(`/quizzes/basedict-test/${selectedLevel}`)}
        className="w-fit block mx-auto mt-8 text-base"
        variant={"secondary"}
      >
        {isLoading ? "Đang tải..." : "Vào làm bài"}
      </Button>
    </div>
  );
}
