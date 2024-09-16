type TFlashCard = {
  id: number;
  title: string;
  description: string;
  updatedAt: string;
  owner: TUser;
  learnedNumber: number;
  learningNumber: number;
  flashCardNumber: number;
};

type TFlashcardCreator = TUser & {
  flashCardSetNumber: number;
  totalLearnedNumber: number;
  totalLearningNumber: number;
};
