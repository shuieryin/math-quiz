import { Equation, EquationResult } from "../lib/types";
import { genSequence } from "./equationUtils";

class Addition extends Equation {
	minNum = 3;
	step = 2;

	constructor(maxNum: number, digitSize: number) {
		super(maxNum, digitSize);

		if (digitSize === 2) {
			this.maxQuestionSize = 100;
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
