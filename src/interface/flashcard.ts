type TFlashcardSet = {
  id: number;
  title: string;
  description: string;
  updatedAt: string;
  learnedNumber: number;
  learningNumber: number;
  owner?: TUser;
  flashCards?: TFlashCardItem[];
  tags?: string[];
  isLearning?: boolean;
  flashCardNumber?: number;
};

type TFlashcardCreator = TUser & {
  flashCardSetNumber: number;
  totalLearnedNumber: number;
  totalLearningNumber: number;
};

type TFlashcardSetOwner = TUser & {
  flashCardSets: TFlashcardSet[];
  totalLearnedNumber: number;
  totalLearningNumber: number;
};

type TMyFlashcard = {
  myFlashCards: TFlashcardSet[];
  learningFlashCards: TFlashcardSet[];
  totalLearnedNumber: number;
  totalLearningNumber: number;
};

type TFlashCardItem = {
  id: number;
  backSide: string;
  backSideComment: string;
  frontSide: string;
  frontSideComment: string;
};

type TFlashcardTag = {
  id: number;
  count: number;
  name: string;
};
