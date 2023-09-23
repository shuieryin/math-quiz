import { genDefaultQuestion } from "../equation/equationUtils";
import { IncorrectQuestionV9, QuizReportV9 } from "./MigrateDbStoreUtils";
import { QuizId } from "./QuestionGenerator";
import { MAX_END_NUMBER } from "./utils";

export type DivisionRemQuestion = { dividend: number; divisor: number };
export type DivisionRemAnswer = { quotient?: number; remainder?: number };
export type Answer = number | DivisionRemAnswer;

export type QuestionContent = string | DivisionRemQuestion;
export type Question = {
	quizId?: QuizId;
	questionContent: QuestionContent;
	answer: Answer;
	inputAnswer?: Answer;
	correct?: boolean;
	prev?: Question;
	next?: Question;
	focusInput?: () => void;
	isReuse?: boolean;
	handleSubmit: <InputPayload>(InputPayload) => boolean;
	genQuestionCard: (submitted: boolean) => JSX.Element;
};
export type Questions = Question[];

export type IncorrectQuestion = Required<
	Pick<Question, "answer" | "quizId">
> & { count?: number; questionContent: string };

export type DoGenParams = Required<
	Pick<Question, "quizId" | "questionContent" | "answer">
> &
	Pick<Question, "isReuse">;

export type EquationResult = DoGenParams &
	Required<Pick<Question, "handleSubmit" | "genQuestionCard">> &
	Pick<Question, "inputAnswer">;

export type QuizReport = {
	quizId: QuizId;
	correctCount: number;
	totalCount: number;
	createTime: number;
	elapsedMilli: number;
};

export type StoreName = "quizReport" | "incorrectQuestion";

export type StoreRecord =
	| QuizReport
	| IncorrectQuestion
	| QuizReportV9
	| IncorrectQuestionV9;

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

export class Equation {
	numberRanges: NumberRange[];
	maxQuestionSize: number;
	genQuestion: (quizId: QuizId) => EquationResult;
	genQuestionWithState = genDefaultQuestion;

	constructor(numberRanges: NumberRange[]) {
		this.numberRanges = numberRanges;
		const maxNum = numberRanges[0].end ?? MAX_END_NUMBER;
		const digitSize = numberRanges.length;
		if (digitSize === 2 && maxNum <= 20) {
			this.maxQuestionSize = 80;
		} else if (digitSize === 3 && maxNum <= 100) {
			this.maxQuestionSize = 300;
		} else {
			this.maxQuestionSize = 500;
		}
	}
}
