import { Markdown } from "@/shared/ui";
import { ReadingQuestion } from "@/widgets";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { stateSwitcherVariant, TestState } from "@/features/quizzes/const";
import { HistoryDialog } from "@/features/quizzes/general/HistoryDialog";
import { TDateWithExamRes } from "@/features/quizzes/general/utils";
import {
  StateSwitcher,
  TStateSwitcherRef,
} from "@/features/quizzes/components/JlptTestModule/StateSwitcher";
import { postRequest } from "@/service/data";
import { useAnswerStore } from "@/store/useAnswerStore";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import useSWRMutation from "swr/mutation";

export function JlptTestQuestions({
  data,
  isDailyTest,
}: {
  data: TQuiz | undefined;
  isDailyTest?: boolean;
}) {
  const { userAnswers } = useAnswerStore();

  const stateSwitcherRef = useRef<TStateSwitcherRef>(null);
  const [resetKey, setResetKey] = useState(0);
  const [examResult, setExamResult] = useState<TDateWithExamRes | null>(null);
  const [testState, setTestState] = useState(
    data?.isDone ? TestState.Done : TestState.Ready
  );

  const [alertOpen, setAlertOpen] = useState(false);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  const { trigger: submitAnswers } = useSWRMutation(
    `/v1/exams/${data?.id}/exam-execute`,
    postRequest
  );

  const questions = data?.questions ?? [];
  const readings = data?.readings ?? [];

  const initialReadingQuesIndex = questions.length;
  let prevReadingQuestionsLengthAcc = 0;
  const selectionDisabled = testState !== TestState.Doing;
  const shouldShowAns = testState === TestState.Done;

  function countCorrectAnswers() {
    return questions?.reduce((acc, question, i) => {
      if (question.correctAnswer === userAnswers[i]?.split("|")?.[0] || "") {
        return acc + 1;
      }
      return acc;
    }, 0);
  }

  function countQuestionAmount() {
    const vocabAmount = questions?.length ?? 0;
    let readingAmount = 0;

    readings.forEach((reading) => {
      readingAmount += reading.questions.length;
    });

    return vocabAmount + readingAmount;
  }

  function switchTestState() {
    switch (testState) {
      case TestState.Ready:
        setTestState(TestState.Doing);
        break;
      case TestState.Doing:
        setTestState(TestState.Paused);
        break;
      case TestState.Paused:
        setTestState(TestState.Doing);
        break;
      case TestState.Done:
        setTestState(TestState.Doing);
        stateSwitcherRef.current?.resetTimer();
        useAnswerStore.getState().clearUserAnswers();
        setResetKey((prevKey) => prevKey + 1);
        break;
    }
  }

  async function handleSubmitAnswers() {
    const { userAnswers } = useAnswerStore.getState();

    const answers = Array.from(
      { length: questions.length + readings.length },
      (_, i) => userAnswers[i]?.split("|")?.[0] || ""
    );
    const res = await submitAnswers({ answers });
    setExamResult({ ...res, createdAt: new Date() });
    setHistoryDialogOpen(true);
  }

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (testState === TestState.Doing) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [testState]);

  return (
    <div>
      <StateSwitcher
        ref={stateSwitcherRef}
        showResultDialog={() => setResultDialogOpen(true)}
        testState={testState}
        variant={stateSwitcherVariant[testState]}
        switchTestState={switchTestState}
        showAlert={() => setAlertOpen(true)}
        isDailyTest={isDailyTest}
      />

      <div className="mt-2 overflow-auto">
        {questions.map((question, index) => {
          const key = `|${index}`;
          return (
            <ReadingQuestion
              key={key}
              index={key} // answers can be duplicated, so we need to add index to make it unique
              value={userAnswers[index]}
              selectionDisabled={selectionDisabled}
              shouldShowAns={shouldShowAns && !isDailyTest}
              questionText={`${index + 1}\\. ${question.question}`}
              radioGroupKey={`${index}-${resetKey}`}
              question={question}
              testState={testState}
            />
          );
        })}

        {readings.map((reading, i) => {
          const prevReadingQuestionsLength = (readings[i - 1]?.questions ?? [])
            .length;
          prevReadingQuestionsLengthAcc += prevReadingQuestionsLength;
          return (
            <div key={i}>
              <div className="bg-gray-200 whitespace-pre-line p-2 rounded-sm mb-1">
                <Markdown markdown={reading?.japanese} />
              </div>
              {reading.questions?.map((question, j) => {
                const readingQuesIndex =
                  initialReadingQuesIndex + prevReadingQuestionsLengthAcc + j;
                const key = `|${readingQuesIndex}`;
                return (
                  <ReadingQuestion
                    key={key}
                    index={key} // answers can be duplicated, so we need to add index to make it unique
                    value={userAnswers[readingQuesIndex]}
                    selectionDisabled={selectionDisabled}
                    shouldShowAns={shouldShowAns && !isDailyTest}
                    questionText={`${readingQuesIndex + 1}\\. ${
                      question.question
                    }`}
                    radioGroupKey={`${readingQuesIndex}-${resetKey}`}
                    question={question}
                    testState={testState}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      <HistoryDialog
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
        rankPoint={examResult?.rankPoint ?? 0}
        examResult={examResult}
      />

      <Dialog open={resultDialogOpen} onOpenChange={setResultDialogOpen}>
        <DialogContent aria-describedby="show-result" className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-semibold mx-auto w-fit text-lg">
              Kết quả làm đề thi
            </DialogTitle>
          </DialogHeader>
          <div className="w-fit mx-auto mt-3">
            <div>
              <span className="w-[140px] inline-block">Đề thi:</span>
              <span className="font-semibold">
                {data?.title ?? "Basedict Test"}
              </span>
            </div>
            <div>
              <span className="w-[140px] inline-block">Cấp độ: </span>
              <span className="font-semibold">{data?.jlptLevel}</span>
            </div>
            <div>
              <span className="w-[140px] inline-block">Thời gian làm bài:</span>
              <span className="font-semibold">
                {stateSwitcherRef.current?.currentTimeInMin}
              </span>
            </div>
            <div>
              <span className="w-[140px] inline-block">Số câu đúng:</span>
              <span className="font-semibold">
                {countCorrectAnswers()}/{countQuestionAmount()}
              </span>
            </div>
          </div>
          <DialogFooter>
            <DialogClose>Đóng</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent aria-describedby="end-test">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có muốn kết thúc bài thi ở đây không?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setTestState(TestState.Done);
                if (isDailyTest) handleSubmitAnswers();
                else setResultDialogOpen(true);
              }}
            >
              Đồng ý
            </AlertDialogAction>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
