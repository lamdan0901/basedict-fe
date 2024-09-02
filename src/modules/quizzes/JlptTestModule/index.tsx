import { Card, CardContent } from "@/components/ui/card";
import { JLPTTestDescModal } from "@/modules/quizzes/JLPTTestDescModal";
import { JlptTestQuestions } from "@/modules/quizzes/JlptTestModule/JlptTestQuestions";

type Props = {
  data: TJlptTestItem | undefined;
  title: string | undefined;
};

export function JlptTestModule({ title = "", data }: Props) {
  return (
    <Card>
      <CardContent>
        <h2
          dangerouslySetInnerHTML={{ __html: title }}
          className="font-semibold text-2xl mt-4 mx-auto w-fit"
        ></h2>
        <div className="w-fit ml-auto">
          <JLPTTestDescModal />
        </div>
        <JlptTestQuestions data={data} />
      </CardContent>
    </Card>
  );
}
