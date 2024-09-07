import { Card, CardContent } from "@/components/ui/card";
import { JLPTTestDescModal } from "@/modules/quizzes/JLPTTestDescModal";
import { JlptTestQuestions } from "@/modules/quizzes/JlptTestModule/JlptTestQuestions";

type Props = {
  data: TJlptTestItem | undefined;
  title: string | undefined;
  isDailyTest?: boolean;
};

export function JlptTestModule({ title = "", data, isDailyTest }: Props) {
  return (
    <Card>
      <CardContent>
        <h2
          dangerouslySetInnerHTML={{ __html: title }}
          className="font-semibold text-center text-2xl mt-4 mx-auto w-fit"
        ></h2>
        <div className="w-fit ml-auto">
          <JLPTTestDescModal />
        </div>
        <JlptTestQuestions isDailyTest={isDailyTest} data={data} />
      </CardContent>
    </Card>
  );
}
