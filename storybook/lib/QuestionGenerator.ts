import {
	Answer,
	DoGenParams,
	Equation,
	EquationOptions,
	NumberRange,
	Question,
	QuestionContent,
	Questions
} from "./types";
import { shuffle } from "./utils";
import nls from "../nls";
import {
	NlsDigitKey,
	NlsGradeKey,
	NlsKey,
	NlsMethodKey,
	NlsWithinKey
} from "../nls/types";

const defaultQuestionSizes = [
	1, 2, 3, 5, 10, 20, 30, 50, 60, 80, 100, 120, 150, 200, 500, 750, 1000, 1500,
	2000, 3000
];

export type QuizId =
	`${NlsGradeKey}_${NlsWithinKey}_${NlsMethodKey}_${NlsDigitKey}`;

class QuestionGenerator<QuestionType = QuestionContent, AnswerType = Answer> {
	private readonly id: QuizId;
	equation: Equation<QuestionType, AnswerType>;

	constructor({
		id,
		numberRanges,
		EquationClass,
		options
	}: {
		id: QuizId;
		numberRanges: NumberRange[];
		EquationClass: typeof Equation<QuestionType, AnswerType>;
		options?: EquationOptions;
	}) {
		this.id = id;
		this.equation = new EquationClass(numberRanges, options);
	}

	questionSizes = () =>
		defaultQuestionSizes.filter(size => size <= this.equation.maxQuestionSize);

	genQuestions = (
		questionSize: number,
		incorrectQuestions: Questions<QuestionType, AnswerType> = []
	): Questions<QuestionType, AnswerType> => {
		const usedQuestions = new Set();
		const needShuffle = incorrectQuestions.length > 1;

		const questions: Questions<QuestionType, AnswerType> = [];
		const maxUsedCount = questionSize * 3;
		for (
			let i = 0;
			i < Math.min(questionSize, this.equation.maxQuestionSize);
			i++
		) {
			let question: Question<QuestionType, AnswerType>;
			let usedCount = 0;

			if (incorrectQuestions.length > 0) {
				question = incorrectQuestions.pop();
			} else {
				do {
					question = this.equation.genQuestion(this.getId());
					usedCount++;
				} while (
					usedQuestions.has(question.questionContent) &&
					usedCount <= maxUsedCount
				);
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

		let lastQuestion: Question<QuestionType, AnswerType>;
		for (const question of questions) {
			if (lastQuestion) {
				question.prev = lastQuestion;
				lastQuestion.next = question;
			}
			lastQuestion = question;
		}

		return questions;
	};

	getId() {
		return this.id;
	}

	getName() {
		return this.id
			.split("_")
			.map(nlsKey => nls.get(nlsKey as NlsKey))
			.join("/");
	}

	getTitle() {
		return this.getName().replaceAll("/", " - ");
	}

	genQuestion(params: DoGenParams<QuestionType, AnswerType>) {
		return this.equation.genQuestionWithState(params);
	}
}

export default QuestionGenerator;
