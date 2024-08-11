const MAX_LENGTH = 7;

// Function to validate if the text contains only Kanji or Hiragana, or only Katakana characters
export function isJapanese(text: string): boolean {
  const isLengthValid = text.length <= MAX_LENGTH;
  if (!isLengthValid) return false;
  return /^(?:[\u4E00-\u9FBF\u3040-\u309F]+|[\u30A0-\u30FF]+)$/.test(text);
}

// Function to validate if the text does not end with forbidden forms
export function isNotEndingWithForbiddenForms(text: string): boolean {
  const acceptWords = ["ごった", "ばった", "めった"];
  if (acceptWords.includes(text)) return true;

  const forbiddenEndings = [
    "ました",
    "います",
    "きます",
    "ります",
    "します",
    "させる",
    "られる",
    "せます",
    "れます",
    "です",
    "った",
    "でした",
    "させた",
    "られた",
  ];

  return !forbiddenEndings.some((ending) => text.endsWith(ending));
}

// Example usage
// const text = "あなたのテキスト";

// const isValid1 = isNotEndingWithForbiddenForms(text);
// const isValid2 = isJapanese(text);
// if (!isValid1) console.log("Không được kết thúc bằng các từ không được phép.");
// if (!isValid2)
//   console.log(
//     "Input should only contain Kanji or Hiragana, or only Katakana characters"
//   );
