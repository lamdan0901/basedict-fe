"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jlptLevels } from "@/constants";
import { useRouter } from "next/navigation";

export function LevelSelector({
  jlptLevel = "N1",
}: {
  jlptLevel?: TJlptLevel;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="shrink-0">Cấp độ</Label>
      <Select
        onValueChange={(level) =>
          router.push(`/quizzes/jlpt-test?jlptLevel=${level}`)
        }
        value={jlptLevel}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select a level" />
        </SelectTrigger>
        <SelectContent>
          {jlptLevels.map((level) => (
            <SelectItem key={level.value} value={level.value}>
              {level.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
