import { LevelSelector } from "@/modules/quizzes/jlpt-test/test-list/LevelSelector";
import { JLPTTestDescModal } from "@/modules/quizzes/jlpt-test/JLPTTestDescModal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

type Props = {
  jlptLevel?: TJlptLevel;
  jlptTests: TTestPeriod[];
};

export function JLPTTests({ jlptLevel, jlptTests }: Props) {
  return (
    <Card>
      <CardContent className="space-y-6 mt-4">
        <h2 className="font-semibold text-2xl mx-auto w-fit">Làm đề JLPT</h2>

        <div className="flex items-end w-full justify-between">
          <LevelSelector jlptLevel={jlptLevel} />
          <JLPTTestDescModal />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {jlptTests.map((test) => (
            <Link href={`/quizzes/jlpt-test/${test.id}`} key={test.id}>
              <Badge className="w-full h-12 text-base justify-center">
                {test.title}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
