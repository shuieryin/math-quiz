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
	Divisors,
	DoGenParams,
	EquationResult,
	Fraction,
	GenFractionItem,
	GenFractionOptions,
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
	const divisor = randInt(divisorStart, divisorEnd);

	const quotient = Math.trunc(dividend / divisor);
	const remainder = dividend % divisor;
	return {
		quotient,
		remainder,
		dividend,
		divisor
	};
};

export const genDefaultQuestion = <QuestionType, AnswerType>({
	questionContent,
	answer,
	isReuse,
	quizId
}: DoGenParams<QuestionType, AnswerType>): EquationResult<
	QuestionType,
	AnswerType
> => {
	return {
		quizId,
		questionContent,
		answer,
		handleSubmit: (inputAnswer: AnswerType) => {
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

const findDivisors = (num: number): Divisors => {
	const results: Divisors = {};
	for (let i = num; i > 1; i--) {
		if (num % i === 0) {
			results[i] = true;
		}
	}
	return results;
};

const findCommonDivisors = (
	aDivisors: Divisors,
	bDivisors: Divisors
): number[] => {
	const result: number[] = [];
	for (const key in aDivisors) {
		const curDivisor = key as unknown as number;
		if (bDivisors[curDivisor]) {
			result.push(curDivisor);
		}
	}
	result.sort((a, b) => b - a);
	return result;
};

export const genFraction = (
	{
		numeratorRange: {
			start: numeratorStart = 1,
			end: numeratorEnd = Number.MAX_SAFE_INTEGER
		},
		denominatorRange: {
			start: denominatorStart = 1,
			end: denominatorEnd = Number.MAX_SAFE_INTEGER
		}
	}: GenFractionItem,
	{ isNumeratorLessThanDenominator }: GenFractionOptions = {}
): Fraction => {
	if (numeratorStart > numeratorEnd) {
		throw new Error(
			`Numerator end must be greater than start, start: [${numeratorStart}], end: [${numeratorEnd}]`
		);
	} else if (denominatorStart > denominatorEnd) {
		throw new Error(
			`Denominator end must be greater than start, start: [${denominatorStart}], end: [${denominatorEnd}]`
		);
	} else if (denominatorStart === 0 || denominatorEnd === 0) {
		throw new Error(
			`Denominator cannot be zero, start: [${denominatorStart}], end: [${denominatorEnd}]`
		);
	}

	const denominator = randInt(denominatorStart, denominatorEnd);
	const denominatorDivisors = findDivisors(denominator);
	let hasCommonDivisor = false;
	let numerator: number;
	if (isNumeratorLessThanDenominator) {
		numeratorEnd = denominator - 1;
	}
	let genNumeratorCount = 0;
	do {
		numerator = randInt(numeratorStart, numeratorEnd);
		const numeratorDivisors = findDivisors(numerator);
		if (numerator < denominator) {
			hasCommonDivisor =
				findCommonDivisors(denominatorDivisors, numeratorDivisors).length > 0;
		} else {
			hasCommonDivisor =
				findCommonDivisors(numeratorDivisors, denominatorDivisors).length > 0;
		}
		genNumeratorCount++;
	} while (hasCommonDivisor && genNumeratorCount < 10);

	return { numerator, denominator };
};

export const reduceFraction = ({
	numerator,
	denominator
}: Fraction): Fraction => {
	const numeratorDivisors = findDivisors(numerator);
	const denominatorDivisors = findDivisors(denominator);
	let commonDivisors: number[];
	if (numerator < denominator) {
		commonDivisors = findCommonDivisors(denominatorDivisors, numeratorDivisors);
	} else {
		commonDivisors = findCommonDivisors(numeratorDivisors, denominatorDivisors);
	}
	let nextNumerator = numerator;
	let nextDenominator = denominator;
	let hcf = 1;
	if (commonDivisors.length) {
		hcf = Number(commonDivisors[0]);
		nextNumerator /= hcf;
		nextDenominator /= hcf;
	}

	return { numerator: nextNumerator, denominator: nextDenominator, hcf };
};

export const genFractionAddition = (
	items: GenFractionItem[],
	options: GenFractionOptions = {}
): Fraction[] => {
	const { nonHcfChance } = options;
	const isAllowNonHcf = nonHcfChance > Math.random();
	let fractions: Fraction[];
	let answer: Fraction;
	do {
		answer = { numerator: 0, denominator: 0 };
		fractions = [];
		for (const item of items) {
			const curFraction = genFraction(item, options);
			fractions.push(curFraction);
			const { numerator: curNumerator, denominator: curDenominator } =
				curFraction;

			let hcf = 1;
			if (answer.denominator) {
				if (answer.denominator !== curDenominator) {
					hcf *= answer.denominator;
					answer.denominator *= curDenominator;
					answer.numerator *= curDenominator;
				}
			} else {
				answer.denominator = curDenominator;
			}

			if (answer.numerator) {
				answer.numerator += curNumerator * hcf;
			} else {
				answer.numerator = curNumerator;
			}
		}
		answer = reduceFraction(answer);
	} while (!isAllowNonHcf && answer.hcf === 1);
	fractions.unshift(answer);

	return fractions;
};
