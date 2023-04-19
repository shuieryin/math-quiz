import { genSingleAnswerQuestion } from "../equation/equationUtils";

export type DivisionRemAnswer = { quotient: number; remainder: number };
export type Answer = number | DivisionRemAnswer;

export type Question = {
	quizName?: string;
	questionContent: string;
	answer: Answer;
	inputAnswer?: Answer;
	correct?: boolean;
	prev?: Question;
	next?: Question;
	focusInput?: () => void;
	isReuse?: boolean;
	handleSubmit: <InputPayload>(InputPayload) => boolean;
	genQuestionCard: (submitted: boolean) => JSX.Element;
	displayInputAnswer: () => JSX.Element;
};
export type Questions = Question[];

export type IncorrectQuestion = Required<
	Pick<Question, "questionContent" | "answer" | "quizName">
> & { count?: number };

export type DoGenParams = Required<
	Pick<Question, "questionContent" | "answer">
> &
	Pick<Question, "isReuse">;

export type EquationResult = DoGenParams &
	Required<
		Pick<Question, "handleSubmit" | "genQuestionCard" | "displayInputAnswer">
	> &
	Pick<Question, "inputAnswer">;

export class Equation {
	maxNum: number;
	digitSize: number;
	maxQuestionSize: number;
	genQuestion: () => EquationResult;
	genQuestionWithState = genSingleAnswerQuestion;

	constructor(maxNum: number, digitSize = 2) {
		this.maxNum = maxNum;
		this.digitSize = digitSize;
		if (digitSize === 2 && maxNum <= 20) {
			this.maxQuestionSize = 80;
		} else if (digitSize === 3 && maxNum <= 100) {
			this.maxQuestionSize = 300;
		} else {
			this.maxQuestionSize = 500;
		}
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

export const clearInputPressedMilliThreshold = 300;

export type QuizSummary = {
	totalCorrect: number;
	totalSize: number;
	perQuestionTookMilli: number;
};

export type NumberRange =
	| { start: number; end?: number }
	| { start?: number; end: number };
