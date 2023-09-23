import React from "react";
import {
	MAX_END_NUMBER,
	MIN_START_NUMBER,
	randBool,
	randInt
} from "../lib/utils";
import {
	DivisionRemAnswer,
	DivisionRemQuestion,
	DoGenParams,
	EquationResult,
	NumberRange
} from "../lib/types";
import QuestionCard from "../components/QuestionCard";

export const genAddSubSequence = (
	numberRanges: NumberRange[],
	step: number
): number[] => {
	let lastDigit: number;
	const digits = [];
	for (let i = 0; i < numberRanges.length; i++) {
		const { start = MIN_START_NUMBER, end = MAX_END_NUMBER } = numberRanges[i];
		if (lastDigit == undefined) {
			lastDigit = end;
		}

		const endInt = lastDigit - step;
		const curDigit = randInt(start, endInt);

		digits.push(curDigit);
		if (i === 0) {
			lastDigit = curDigit;
		} else {
			lastDigit -= curDigit;
		}
	}
	digits.push(lastDigit);
	return digits;
};

export const genAddSubVariants = (
	numberRanges: NumberRange[],
	step: number
): { digits: number[]; questionContent: string } => {
	let questionContent = "";
	let answer = NaN;
	let lastMax: number;
	let operator = 1;
	const digits = [];
	for (let i = 0; i < numberRanges.length; i++) {
		const { start = MIN_START_NUMBER, end = MAX_END_NUMBER } = numberRanges[i];
		if (lastMax == undefined) {
			lastMax = end;
		}

		const curDigit = randInt(start, lastMax);
		const curDigitWithOp = curDigit * operator;
		digits.push(curDigit * operator);

		if (i === 0) {
			answer = curDigitWithOp;
			questionContent = String(curDigit);
		} else {
			answer += curDigitWithOp;
			questionContent += ` ${operator > 0 ? "+" : "-"} ${curDigit}`;
		}

		if (curDigit <= start + step) {
			operator = 1;
		} else if (curDigit >= end - step) {
			operator = -1;
		} else {
			operator = randBool() ? 1 : -1;
		}

		if (operator > 0) {
			lastMax = end - answer - step;
		} else {
			lastMax = answer - step;
		}
	}
	digits.unshift(answer);
	return { digits, questionContent };
};

export const genMulDivSequence = (numberRanges: NumberRange[]): number[] => {
	let answer = 1;
	const digits = [];
	for (const {
		start = MIN_START_NUMBER,
		end = MAX_END_NUMBER
	} of numberRanges) {
		const curDigit = randInt(start, end);
		answer *= curDigit;
		digits.push(curDigit);
	}
	digits.push(answer);
	return digits;
};

export const genDivRemSequence = ({
	dividendRange: {
		start: dividendStart = Number.MIN_SAFE_INTEGER,
		end: dividendEnd = Number.MAX_SAFE_INTEGER
	},
	divisorRange: {
		start: divisorStart = Number.MIN_SAFE_INTEGER,
		end: divisorEnd = Number.MAX_SAFE_INTEGER
	}
}: {
	dividendRange: NumberRange;
	divisorRange: NumberRange;
}): DivisionRemQuestion & DivisionRemAnswer => {
	if (dividendStart > dividendEnd) {
		throw new Error(
			`Dividend end must be greater than start, start: [${dividendStart}], end: [${dividendEnd}]`
		);
	} else if (divisorStart > divisorEnd) {
		throw new Error(
			`Divisor end must be greater than start, start: [${divisorStart}], end: [${divisorEnd}]`
		);
	} else if (divisorStart === 0 || divisorEnd === 0) {
		throw new Error(
			`Divisor cannot be zero, start: [${divisorStart}], end: [${divisorEnd}]`
		);
	}

	const dividend = randInt(dividendStart, dividendEnd);
	let divisor = randInt(divisorStart, divisorEnd);
	if (divisor === 0) divisor = 1;

	const quotient = Math.trunc(dividend / divisor);
	const remainder = dividend % divisor;
	return {
		quotient,
		remainder,
		dividend,
		divisor
	};
};

export const genDefaultQuestion = ({
	questionContent,
	answer,
	isReuse,
	quizId
}: DoGenParams): EquationResult => {
	return {
		quizId,
		questionContent,
		answer,
		handleSubmit: (inputAnswer: number) => {
			return inputAnswer === answer;
		},
		isReuse,
		genQuestionCard(submitted) {
			return (
				<QuestionCard
					key={`question-${questionContent}`}
					question={this}
					disabled={submitted}
				/>
			);
		}
	};
};
