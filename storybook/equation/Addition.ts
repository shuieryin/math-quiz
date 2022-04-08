import { Equation, EquationResult } from "../lib/types";
import { genSequence } from "./equationUtils";

class Addition extends Equation {
	minNum = 2;
	step = 3;

	constructor(maxNum: number, digitSize: number) {
		super(maxNum, digitSize);

		if (digitSize === 2 && maxNum <= 20) {
			this.maxQuestionSize = 80;
		} else if (digitSize === 3 && maxNum <= 100) {
			this.maxQuestionSize = 300;
		} else {
			this.maxQuestionSize = 500;
		}
	}

	gen = (): EquationResult => {
		const [answer, ...digits] = genSequence(
			this.digitSize,
			this.minNum,
			this.maxNum,
			this.step
		);

		const questionContent = digits.join(" + ");

		return {
			questionContent,
			answer
		} as EquationResult;
	};
}

export default Addition;
