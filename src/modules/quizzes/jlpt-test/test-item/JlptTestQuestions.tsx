import { ReadingAnswer } from "@/components/ReadingAnswer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { stateSwitcherVariant, TestState } from "@/modules/quizzes/const";
import {
  StateSwitcher,
  TStateSwitcherRef,
} from "@/modules/quizzes/jlpt-test/test-item/StateSwitcher";
import { useRef, useState } from "react";

export function JlptTestQuestions({
  data,
}: {
  data: TJlptTestItem | undefined;
}) {
  const stateSwitcherRef = useRef<TStateSwitcherRef>(null);
  const [resetKey, setResetKey] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [testState, setTestState] = useState(TestState.Ready);

  const questions = data?.questions ?? [];
  const readings = data?.readings ?? [];

  const initialReadingQuesIndex = questions.length;
  const selectionDisabled = testState !== TestState.Doing;
  const shouldShowAns = testState === TestState.Done;

  function countCorrectAnswers() {
    return questions?.reduce((acc, question, index) => {
      if (question.correctAnswer === userAnswers[index]) {
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
        setUserAnswers({});
        setResetKey((prevKey) => prevKey + 1);
        break;
    }
  }

  return (
    <div>
      <div className="h-[calc(100vh-310px)] mb-2 overflow-auto">
        {questions?.map((question, index) => {
          return (
            <ReadingAnswer
              key={index}
              selectionDisabled={selectionDisabled}
              shouldShowAns={shouldShowAns}
              questionText={`${index + 1}. ${question.question}`}
              radioGroupKey={`${index}-${resetKey}`}
              question={question}
              value={userAnswers[index]}
              onValueChange={(ans) => {
                if (selectionDisabled) return;
                setUserAnswers({
                  ...userAnswers,
                  [index]: ans,
                });
              }}
            />
          );
        })}

        {readings.map((reading, i) => (
          <div key={i}>
            <div className="bg-gray-200 whitespace-pre-line p-2 rounded-sm mb-1">
              {reading.japanese}
            </div>
            {reading.questions?.map((question, j) => {
              const readingQuesIndex =
                initialReadingQuesIndex +
                (readings[i - 1]?.questions ?? []).length +
                j;

              return (
                <ReadingAnswer
                  key={j}
                  selectionDisabled={selectionDisabled}
                  shouldShowAns={shouldShowAns}
                  questionText={`${readingQuesIndex + 1}. ${question.question}`}
                  radioGroupKey={`${readingQuesIndex}-${resetKey}`}
                  question={question}
                  value={userAnswers[readingQuesIndex]}
                  onValueChange={(ans) => {
                    if (selectionDisabled) return;
                    setUserAnswers({
                      ...userAnswers,
                      [readingQuesIndex]: ans,
                    });
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      <StateSwitcher
        ref={stateSwitcherRef}
        testState={testState}
        variant={stateSwitcherVariant[testState]}
        switchTestState={switchTestState}
        showAlert={() => setAlertOpen(true)}
      />

      {shouldShowAns && (
        <div className="border mt-3 w-full max-w-[400px] mx-auto border-muted-foreground p-2">
          <h2 className="font-semibold mx-auto mb-4 w-fit text-lg">
            Kết quả làm đề thi
          </h2>
          <div className="w-fit mx-auto">
            <div>
              <span className="w-[140px] inline-block">Đề thi:</span>
              <span className="font-semibold">{data?.title}</span>
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
        </div>
      )}

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có muốn kết thúc bài thi ở đây không?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setTestState(TestState.Done);
              }}
            >
              Đồng ý
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
