import { ReactElement } from "react";

export type IntRange = {
	start?: number;
	end?: number;
};

export type Question = {
	questionContent: string;
	answer: number;
	inputElement?: HTMLInputElement;
	correct?: boolean;
	prev?: Question;
	next?: Question;
};

export type Questions = Question[];

export type SubmittedQuestion = Required<
	Pick<Question, "questionContent" | "answer">
> & {
	inputAnswer: string;
};

export type SubmittedQuestions = SubmittedQuestion[];

export type IncorrectQuestion = Required<
	Pick<Question, "questionContent" | "answer">
> & { count?: number };

export type IncorrectQuestions = IncorrectQuestion[];

export type EquationResult = Required<
	Pick<Question, "questionContent" | "answer">
>;

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

export type QuizReport = {
	quizName: string;
	correctCount: number;
	totalCount: number;
	createTime: number;
	elapsedMilli: number;
};

export type StoreName = "quizReport" | "incorrectQuestion";

export type StoreRecord = QuizReport | IncorrectQuestion;

export type StoreConfig = {
	name: StoreName;
	options: IDBObjectStoreParameters;
	indexes: {
		[key: string]: IDBIndexParameters;
	};
};

export const incorrectQuestionPenalty = 3;

export type DisplayTypeAtom =
	| string
	| number
	| boolean
	| Element
	| ReactElement;
export type DisplayType = DisplayTypeAtom | DisplayTypeAtom[];

export const clearInputPressedMilliThreshold = 300;

export type QuizSummary = {
	totalCorrect: number;
	totalSize: number;
	perQuestionTookMilli: number;
};
