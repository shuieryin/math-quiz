import { randBool, randInt } from "../lib/utils";

export const genSequence = (
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

export const genVariants = (
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
