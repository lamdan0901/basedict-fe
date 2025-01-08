import { useToast } from "@/components/ui/use-toast";
import { QuizRegisterPrompt } from "@/features/quizzes/components/QuizRegisterPrompt";
import { postRequest } from "@/shared/api/request";
import { Check } from "lucide-react";
import { useParams } from "next/navigation";
import { PropsWithChildren, useState } from "react";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RegisterRequiredWrapper({
  children,
  open,
  onOpenChange,
}: PropsWithChildren<Props>) {
  const { toast } = useToast();
  const { id } = useParams();

  const [isForbidden, setIsForbidden] = useState(false);

  const { trigger: startLearning, isMutating: isMutatingStartLearning } =
    useSWRMutation(`/v1/exams/${id}/start-learning`, postRequest);

  async function handleRegisterFlashcardSet() {
    try {
      await startLearning();

      onOpenChange(false);
      mutate("/v1/exams/my-exams");

      toast({
        title: `Đăng kí làm thành công`,
        action: <Check className="h-5 w-5 text-green-500" />,
      });
    } catch (err) {
      if (err === "FORBIDDEN") {
        setIsForbidden(true);
        return;
      }
      toast({
        title: `Đăng kí làm không thành công, hãy thử lại!`,
        variant: "destructive",
      });
      console.log("err", err);
    }
  }

  return (
    <>
      {children}
      <QuizRegisterPrompt
        isForbidden={isForbidden}
        open={open}
        onOpenChange={onOpenChange}
        onRegister={handleRegisterFlashcardSet}
        disabled={isMutatingStartLearning}
        fromLearningPage
      />
    </>
  );
}
