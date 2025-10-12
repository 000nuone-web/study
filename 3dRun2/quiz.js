export const choices = {
  c1: { text: "0"},
  c2: { text: "-1"},
  c3: { text: "1"},
  c4: { text: "1\n\n―\n\n2"},
  c5: { text: "1\n\n―\n\n√2"},
  c6: { text: "√3\n\n―\n\n2"},
  c7: { text: "√3"},
  c8: { text: "1\n\n―\n\n√3"},
  c9: { text: "なし"},
  c10: { text: "-1\n\n―\n\n2"},
  c11: { text: "-1\n\n―\n\n√2"},
  c12: { text: "-√3\n\n―\n\n2"},
  c13: { text: "-√3"},
  c14: { text: "-1\n\n―\n\n√3"}
};

// クイズデータ（LaTeX記法）
export const quiz = [
  {
    question: "sin 0°",
    correct: "c1",
    wrong: ["c2", "c3","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D1","D12","D360"]
  },
  {
    question: "cos 0°",
    correct: "c3",
    wrong: ["c1", "c2", "c4","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D1","D12","D360"]
  },
  {
    question: "tan 0°",
    correct: "c1",
    wrong: ["c2", "c3","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D1","D12","D360"]
  },
    {
    question: "sin 30°",
    correct: "c4",
    wrong: ["c1", "c2", "c3","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D1","D12","D360"]
  },
  {
    question: "cos 30°",
    correct: "c6",
    wrong: ["c1", "c2", "c3","c4","c5","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D1","D12","D360"]
  },
  {
    question: "tan 30°",
    correct: "c8",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c7","c9","c10","c11","c12","c13","c14"],
    tags:["D1","D12","D360"]
  },
    {
    question: "sin 45°",
    correct: "c5",
    wrong: ["c1", "c2", "c3","c4","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D1","D12","D360"]
  },
  {
    question: "cos 45°",
    correct: "c5",
    wrong: ["c1", "c2", "c3","c4","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D1","D12","D360"]
  },
  {
    question: "tan 45°",
    correct: "c3",
    wrong: ["c1", "c2", "c4","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D1","D12","D360"]
  },
    {
    question: "sin 60°",
    correct: "c6",
    wrong: ["c1", "c2", "c3","c4","c5","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D1","D12","D360"]
  },
  {
    question: "cos 60°",
    correct: "c4",
    wrong: ["c1", "c2", "c3","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D1","D12","D360"]
  },
  {
    question: "tan 60°",
    correct: "c7",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D1","D12","D360"]
  },
    {
    question: "sin 90°",
    correct: "c3",
    wrong: ["c1", "c2","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D12","D360"]
  },
  {
    question: "cos 90°",
    correct: "c1",
    wrong: ["c2", "c3","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D12","D360"]
  },
  {
    question: "tan 90°",
    correct: "c9",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c7","c8","c10","c11","c12","c13","c14"],
    tags:["D12","D360"]
  },
    {
    question: "sin 120°",
    correct: "c6",
    wrong: ["c1", "c2", "c3","c4","c5","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D12","D360"]
  },
  {
    question: "cos 120°",
    correct: "c10",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c7","c8","c9","c11","c12","c13","c14"],
    tags:["D12","D360"]
  },
  {
    question: "tan 120°",
    correct: "c13",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c7","c8","c9","c10","c11","c12","c14"],
    tags:["D12","D360"]
  },
    {
    question: "sin 135°",
    correct: "c5",
    wrong: ["c1", "c2", "c3","c4","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D12","D360"]
  },
  {
    question: "cos 135°",
    correct: "c11",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c7","c8","c9","c10","c12","c13","c14"],
    tags:["D12","D360"]
  },
  {
    question: "tan 135°",
    correct: "c2",
    wrong: ["c1", "c3","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D12","D360"]
  },
    {
    question: "sin 150°",
    correct: "c4",
    wrong: ["c1", "c2", "c3","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D12","D360"]
  },
  {
    question: "cos 150°",
    correct: "c12",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c7","c8","c9","c10","c11","c13","c14"],
    tags:["D12","D360"]
  },
  {
    question: "tan 150°",
    correct: "c14",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13"],
    tags:["D12","D360"]
  },
    {
    question: "sin 180°",
    correct: "c1",
    wrong: ["c2", "c3","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D12","D34","D360"]
  },
  {
    question: "cos 180°",
    correct: "c2",
    wrong: ["c1", "c3","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D12","D34","D360"]
  },
  {
    question: "tan 180°",
    correct: "c1",
    wrong: ["c2", "c3","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D12","D34","D360"]
  },
    {
    question: "sin 210°",
    correct: "c10",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c7","c8","c9","c11","c12","c13","c14"],
    tags:["D34","D360"]
  },
  {
    question: "cos 210°",
    correct: "c12",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c7","c8","c9","c10","c11","c13","c14"],
    tags:["D34","D360"]
  },
  {
    question: "tan 210°",
    correct: "c8",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c7","c9","c10","c11","c12","c13","c14"],
    tags:["D34","D360"]
  },
    {
    question: "sin 225°",
    correct: "c11",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c7","c8","c9","c10","c12","c13","c14"],
    tags:["D34","D360"]
  },
  {
    question: "cos 225°",
    correct: "c11",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c7","c8","c9","c10","c12","c13","c14"],
    tags:["D34","D360"]
  },
  {
    question: "tan 225°",
    correct: "c3",
    wrong: ["c1", "c2","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D34","D360"]
  },
    {
    question: "sin 240°",
    correct: "c12",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c7","c8","c9","c10","c11","c13","c14"],
    tags:["D34","D360"]
  },
  {
    question: "cos 240°",
    correct: "c10",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c7","c8","c9","c11","c12","c13","c14"],
    tags:["D34","D360"]
  },
  {
    question: "tan 240°",
    correct: "c7",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D34","D360"]
  },
    {
    question: "sin 270°",
    correct: "c2",
    wrong: ["c1", "c3","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D34","D360"]
  },
  {
    question: "cos 270°",
    correct: "c1",
    wrong: ["c2", "c3","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D34","D360"]
  },
  {
    question: "tan 270°",
    correct: "c9",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c7","c8","c10","c11","c12","c13","c14"],
    tags:["D34","D360"]
  },
    {
    question: "sin 300°",
    correct: "c12",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c7","c8","c9","c10","c11","c13","c14"],
    tags:["D34","D360"]
  },
  {
    question: "cos 300°",
    correct: "c4",
    wrong: ["c1", "c2", "c3","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D34","D360"]
  },
  {
    question: "tan 300°",
    correct: "c13",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c7","c8","c9","c10","c11","c12","c14"],
    tags:["D34","D360"]
  },
    {
    question: "sin 315°",
    correct: "c11",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c7","c8","c9","c10","c12","c13","c14"],
    tags:["D34","D360"]
  },
  {
    question: "cos 315°",
    correct: "c5",
    wrong: ["c1", "c2", "c3","c4","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D34","D360"]
  },
  {
    question: "tan 315°",
    correct: "c2",
    wrong: ["c1", "c3","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D34","D360"]
  },
    {
    question: "sin 330°",
    correct: "c10",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c7","c8","c9","c11","c12","c13","c14"],
    tags:["D34","D360"]
  },
  {
    question: "cos 330°",
    correct: "c6",
    wrong: ["c1", "c2", "c3","c4","c5","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D34","D360"]
  },
  {
    question: "tan 330°",
    correct: "c14",
    wrong: ["c1", "c2", "c3","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13"],
    tags:["D34","D360"]
  },
    {
    question: "sin 360°",
    correct: "c1",
    wrong: ["c2", "c3","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D34","D360"]
  },
  {
    question: "cos 360°",
    correct: "c3",
    wrong: ["c1", "c2","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D34","D360"]
  },
  {
    question: "tan 360°",
    correct: "c1",
    wrong: ["c2", "c3","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13","c14"],
    tags:["D34","D360"]
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
