import { Card, CardContent } from "@/components/ui/card";
import { JLPTTestDescModal } from "@/modules/quizzes/JLPTTestDescModal";
import { JlptTestQuestions } from "@/modules/quizzes/JlptTestModule/JlptTestQuestions";
// import { HistoryDialog } from "@/modules/quizzes/general/HistoryDialog";
// import { useEffect, useRef, useState } from "react";

type Props = {
  data: TJlptTestItem | undefined;
  title: string | undefined;
  isDailyTest?: boolean;
};

export function JlptTestModule({ title = "", data, isDailyTest }: Props) {
  // const hasDialogOpen = useRef<boolean>(false);
  // const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  // // TODO: if isDone = true then show history dialog and disable all buttons, hide the footer

  // useEffect(() => {
  //   if (data?.isDone || !hasDialogOpen.current) {
  //     hasDialogOpen.current = true;
  //     setHistoryDialogOpen(true);
  //   }

  //   return () => {
  //     hasDialogOpen.current = false;
  //   };
  // }, [data?.isDone]);

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
        {/* <HistoryDialog
          open={historyDialogOpen}
          onOpenChange={setHistoryDialogOpen}
        /> */}
      </CardContent>
    </Card>
  );
}
