"use client";

import { VocabClassification } from "@/modules/vocabulary/VocabClassification";
import { VocabList } from "@/modules/vocabulary/VocabList";

export function Vocabulary() {
  return (
    <div className="flex gap-4">
      <VocabClassification />
      <VocabList />
    </div>
  );
}
