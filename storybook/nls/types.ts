export type Lang = "zh" | "en";

export type NlsGradeKey = "grade-one" | "grade-two";
export type NlsWithinKey =
	| "within-100"
	| "within-20"
	| "within-10"
	| "within-1k"
	| "within-10k";
export type NlsMethodKey =
	| "addition"
	| "multiplication"
	| "division"
	| "division-rem"
	| "subtraction"
	| "addition-and-subtraction";
export type NlsDigitKey =
	| "one-number"
	| "two-numbers"
	| "three-numbers"
	| "four-numbers";
export type NlsKey =
	| "yes"
	| "no"
	| "got-question-wrong-in-the-past"
	| "submit-answer"
	| "accuracy-rate"
	| "per-question-spent"
	| "question-unit"
	| "start-quiz"
	| "exit-quiz"
	| "minutes"
	| "seconds"
	| "spent"
	| "got-x-out-of-y-questions-right"
	| "quiz-summary"
	| "quiz-history"
	| "math-quiz"
	| "short-months"
	| "quiz-time"
	| "quiz-time-nosec"
	| "confirm-submit-answers"
	| "make-sure-check-answers"
	| "confirm-exit-quiz"
	| NlsGradeKey
	| NlsWithinKey
	| NlsMethodKey
	| NlsDigitKey;

export type LangPack = { [key in NlsKey]?: string | string[] };
export type LangPacks = {
	[lang in Lang]?: LangPack;
};
export type NlsReplacements = {
	[key: string]: string | ((lang: Lang) => string);
};
