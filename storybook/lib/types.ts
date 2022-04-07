export type IntRange = {
	start?: number;
	end?: number;
};

export type Question = {
	questionContent: string;
	answer: number;
	inputElement?: HTMLInputElement;
	notCorrect?: boolean;
	prev?: Question;
	next?: Question;
};

export type Questions = Question[];

export type EquationResult = Pick<Question, "questionContent" | "answer">;

export class Equation {
	maxNum: number;
	digitSize: number;
	maxQuestionSize: number;
	gen: () => EquationResult;

	constructor(maxNum: number, digitSize = 2) {
		this.maxNum = maxNum;
		this.digitSize = digitSize;
	}
}
