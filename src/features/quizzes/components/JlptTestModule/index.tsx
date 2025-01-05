import { AdSense } from "@/components/ui/ad";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button";
import { Card, CardContent } from "@/components/ui/card";
import { JLPTTestDescLink } from "@/features/quizzes/components/JLPTTestDescLink";
import { JlptTestQuestions } from "@/features/quizzes/components/JlptTestModule/JlptTestQuestions";

type Props = {
  data: TQuiz | undefined;
  title: string | undefined;
  isDailyTest?: boolean;
};

export function JlptTestModule({ title = "", data, isDailyTest }: Props) {
  return (
    <Card>
      <CardContent>
        <div
          id="top-of-jlpt-test"
          className="grid mb-3 grid-cols-1 sm:grid-cols-3"
        >
          <div></div>
          <h2
            dangerouslySetInnerHTML={{ __html: title }}
            className="font-semibold text-center text-2xl mt-4"
          ></h2>
          <JLPTTestDescLink />
        </div>
        <JlptTestQuestions isDailyTest={isDailyTest} data={data} />
        <ScrollToTopButton id="#top-of-jlpt-test" />
      </CardContent>

      <AdSense slot="horizontal" />
    </Card>
  );
}
