import { getRandomInt } from "../lib/utils";

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
		const curDigit = getRandomInt(startInt, endInt);

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
