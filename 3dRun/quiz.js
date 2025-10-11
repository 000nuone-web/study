// クイズデータ（LaTeX記法）
export const quiz = [
  {
    question: "sin 30°",
    correct: "1\n\n―\n\n2",
    wrong: ["0", "-1", "√3\n\n―\n\n2", "1"]
  },
  {
    question: "sin 60°",
    correct: "√3\n\n―\n\n2",
    wrong: ["0", "-1", "1\n\n―\n\n2", "1"]
  },
  {
    question: "sin 90°",
    correct: "1",
    wrong: ["0", "-1", "√3\n\n―\n\n2", "1\n\n―\n\n2"]
  },
  {
    question: "cos 30°",
    correct: "√3\n\n―\n\n2",
    wrong: ["0", "-1", "1\n\n―\n\n2", "1"]
  },
  {
    question: "cos 60°",
    correct: "1\n\n―\n\n2",
    wrong: ["0", "-1", "√3\n\n―\n\n2", "1"]
  }
];



// クイズ1問を選び、選択肢をシャッフルして返す関数
export function getShuffledChoices(quizItem) {
  const shuffledWrong = quizItem.wrong.sort(() => Math.random() - 0.5);
  const selectedWrong = shuffledWrong.slice(0, 2);
  const choices = [...selectedWrong, quizItem.correct].sort(() => Math.random() - 0.5);
  return choices;
}

// クイズ1問を取得（変換済み）
export function getPlainQuiz() {
  const selectedQuiz = quiz[Math.floor(Math.random() * quiz.length)];
  const choices = getShuffledChoices(selectedQuiz);
  const plainQuestion = convertLatexToPlain(selectedQuiz.question);
  const plainChoices = choices.map(convertLatexToPlain);

  return {
    question: plainQuestion,
    correct: convertLatexToPlain(selectedQuiz.correct),
    choices: plainChoices
  };
}
