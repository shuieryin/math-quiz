export type Lang = "zh" | "en";

export type NlsKey =
	| "got-question-wrong-before"
	| "submit-answer"
	| "accuracy-rate"
	| "per-question-spent"
	| "question-unit"
	| "start-quiz"
	| "minutes"
	| "seconds"
	| "spent"
	| "got-x-out-of-y-questions-right"
	| "quiz-summary"
	| "quiz-history"
	| "grade-one"
	| "grade-two"
	| "within-100"
	| "within-20"
	| "within-10"
	| "addition"
	| "multiplication"
	| "division"
	| "subtraction"
	| "addition-and-subtraction"
	| "one-digit"
	| "two-digits"
	| "three-digits"
	| "math-quiz"
	| "short-months"
	| "quiz-time"
	| "quiz-time-nosec";

export type LangPack = { [key in NlsKey]?: string };
export type LangPacks = {
	[lang in Lang]?: LangPack;
};
export type NlsReplacements = {
	[key: string]: string | ((lang: Lang) => string);
};
