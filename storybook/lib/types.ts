import { genDefaultQuestion } from "../equation/equationUtils";
import { IncorrectQuestionV9, QuizReportV9 } from "./MigrateDbStoreUtils";
import { QuizId } from "./QuestionGenerator";
import { MAX_END_NUMBER } from "./utils";

export type DivisionRemQuestion = { dividend: number; divisor: number };
export type DivisionRemAnswer = { quotient?: number; remainder?: number };
export type Answer = number | DivisionRemAnswer | Fraction;

export type QuestionContent = string | DivisionRemQuestion | Fraction[];
export type Question<QuestionType, AnswerType> = {
	quizId?: QuizId;
	questionContent: QuestionType;
	answer: AnswerType;
	inputAnswer?: AnswerType;
	correct?: boolean;
	prev?: Question<QuestionType, AnswerType>;
	next?: Question<QuestionType, AnswerType>;
	focusInput?: () => void;
	isReuse?: boolean;
	handleSubmit: (inputPayload: AnswerType) => boolean;
	genQuestionCard: (submitted: boolean) => JSX.Element;
};
export type Questions<
	QuestionType = QuestionContent,
	AnswerType = Answer
> = Question<QuestionType, AnswerType>[];

export type IncorrectQuestion<
	QuestionType = QuestionContent,
	AnswerType = Answer
> = Required<Pick<Question<QuestionType, AnswerType>, "answer" | "quizId">> & {
	count?: number;
	questionContent: string;
};

export type DoGenParams<QuestionType, AnswerType> = Required<
	Pick<
		Question<QuestionType, AnswerType>,
		"quizId" | "questionContent" | "answer"
	>
> &
	Pick<Question<QuestionType, AnswerType>, "isReuse">;

export type EquationResult<QuestionType, AnswerType> = DoGenParams<
	QuestionType,
	AnswerType
> &
	Required<
		Pick<Question<QuestionType, AnswerType>, "handleSubmit" | "genQuestionCard">
	> &
	Pick<Question<QuestionType, AnswerType>, "inputAnswer">;

export type QuizReport = {
	quizId: QuizId;
	correctCount: number;
	totalCount: number;
	createTime: number;
	elapsedMilli: number;
};

export type StoreName = "quizReport" | "incorrectQuestion";

export type StoreRecord<QuestionType = QuestionContent, AnswerType = Answer> =
	| QuizReport
	| IncorrectQuestion<QuestionType, AnswerType>
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

export class Equation<QuestionType, AnswerType> {
	numberRanges: NumberRange[];
	maxQuestionSize: number;
	genQuestion: (quizId: QuizId) => EquationResult<QuestionType, AnswerType>;
	genQuestionWithState = genDefaultQuestion<QuestionType, AnswerType>;
	options: EquationOptions;

	constructor(numberRanges: NumberRange[], options = {}) {
		this.numberRanges = numberRanges;
		this.options = options;
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

export type Fraction = {
	numerator: number;
	denominator: number;
	hcf?: number;
};

export type GenFractionItem = {
	numeratorRange: NumberRange;
	denominatorRange: NumberRange;
};

export type EquationOptions = {
	isNumeratorLessThanDenominator?: boolean;
	nonHcfChance?: number;
};

export type GenFractionOptions = Pick<
	EquationOptions,
	"isNumeratorLessThanDenominator" | "nonHcfChance"
>;

export type Divisors = { [key: number]: boolean };
