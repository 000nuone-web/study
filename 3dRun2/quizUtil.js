import { choices } from './quiz.js'; // 選択肢データをインポート
import { quiz } from './quiz.js';

export function getFilteredQuiz(tag) {
  return quiz.filter(q => q.tags.includes(tag));
}

export function getShuffledChoices(quizItem) {
  if (!quizItem || !quizItem.wrong) {
    console.warn("Invalid quizItem passed to getShuffledChoices:", quizItem);
    return [];
  }

const shuffledWrong = quizItem.wrong.slice().sort(() => Math.random() - 0.5);

  const selectedWrong = shuffledWrong.slice(0, 2);
  const allIds = [...selectedWrong, quizItem.correct].sort(() => Math.random() - 0.5);

return allIds.map(id => ({
  id,
  text: choices[id]?.text || "（不明）"
}));

}
