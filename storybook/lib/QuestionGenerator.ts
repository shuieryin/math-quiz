import { Equation, Question, Questions } from "./types";
import { shuffle } from "./utils";

const defaultQuestionSizes = [
	10, 20, 30, 50, 60, 80, 100, 120, 150, 200, 500, 750, 1000, 1500, 2000, 3000
];

class QuestionGenerator {
	name: string;
	equation: Equation;

	constructor({
		name,
		maxNum,
		digitSize,
		EquationClass
	}: {
		name: string;
		maxNum: number;
		digitSize: number;
		EquationClass: typeof Equation;
	}) {
		this.name = name;
		this.equation = new EquationClass(maxNum, digitSize);
	}

	questionSizes = () =>
		defaultQuestionSizes.filter(size => size <= this.equation.maxQuestionSize);

	genQuestions = (
		questionSize: number,
		incorrectQuestions: Questions = []
	): Questions => {
		const usedQuestions = new Set();
		const needShuffle = incorrectQuestions.length > 1;

		const questions: Questions = [];
		const maxUsedCount = questionSize * 3;
		for (
			let i = 0;
			i < Math.min(questionSize, this.equation.maxQuestionSize);
			i++
		) {
			let question: Question;
			let usedCount = 0;

			if (incorrectQuestions.length > 0) {
				question = incorrectQuestions.pop();
			} else {
				do {
					question = this.equation.gen();
					usedCount++;
				} while (
					usedQuestions.has(question.questionContent) &&
					usedCount <= maxUsedCount
				);
				question.quizName = this.name;
			}

			if (usedCount > maxUsedCount) {
				break;
			}

			usedQuestions.add(question.questionContent);
			questions.push(question);
		}

		if (needShuffle) {
			shuffle(questions);
		}

		let lastQuestion;
		for (const question of questions) {
			if (lastQuestion) {
				question.prev = lastQuestion;
				lastQuestion.next = question;
			}
			lastQuestion = question;
		}

		return questions;
	};
}

export default QuestionGenerator;
