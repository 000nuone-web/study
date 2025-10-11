export function getShuffledChoices(quizItem) {
  const shuffledWrong = quizItem.wrong.sort(() => Math.random() - 0.5);
  const selectedWrong = shuffledWrong.slice(0, 2);
  const choices = [...selectedWrong, quizItem.correct].sort(() => Math.random() - 0.5);
  return choices;
}
