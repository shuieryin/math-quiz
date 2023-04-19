import React from "react";
import { randBool, randInt } from "../lib/utils";
import { DoGenParams, EquationResult, NumberRange } from "../lib/types";
import QuestionCard from "../components/QuestionCard";

export const genAddSubSequence = (
	digitSize: number,
	minNum: number,
	maxNum: number,
	step: number
) => {
	let lastDigit = maxNum;
	const digits = [];
	for (let i = 0; i < digitSize; i++) {
		const startInt = i === 0 ? minNum + digitSize : minNum;
		const endInt = lastDigit - step;
		const curDigit = randInt(startInt, endInt);

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
	digitSize: number,
	minNum: number,
	maxNum: number,
	step: number
): { digits: number[]; questionContent: string } => {
	let questionContent = "";
	let answer = NaN;
	let lastMax = maxNum;
	let operator = 1;
	const digits = [];
	for (let i = 0; i < digitSize; i++) {
		const curDigit = randInt(minNum, lastMax);
		const curDigitWithOp = curDigit * operator;
		digits.push(curDigit * operator);

		if (i === 0) {
			answer = curDigitWithOp;
			questionContent = String(curDigit);
		} else {
			answer += curDigitWithOp;
			questionContent += ` ${operator > 0 ? "+" : "-"} ${curDigit}`;
		}

		if (curDigit <= minNum + step) {
			operator = 1;
		} else if (curDigit >= maxNum - step) {
			operator = -1;
		} else {
			operator = randBool() ? 1 : -1;
		}

		if (operator > 0) {
			lastMax = maxNum - answer - step;
		} else {
			lastMax = answer - step;
		}
	}
	digits.unshift(answer);
	return { digits, questionContent };
};

export const genMulDivSequence = (
	digitSize: number,
	minNum: number,
	maxNum: number
) => {
	let answer = 1;
	const digits = [];
	for (let i = 0; i < digitSize; i++) {
		const curDigit = randInt(minNum, maxNum);
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
}): { questionContent: string; quotient: number; remainder: number } => {
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
		questionContent: `${dividend} ÷ ${divisor}`,
		quotient,
		remainder
	};
};

export const genSingleAnswerQuestion = ({
	questionContent,
	answer,
	isReuse
}: DoGenParams): EquationResult => {
	return {
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
		},
		displayInputAnswer() {
			return this.inputAnswer;
		}
	};
};
