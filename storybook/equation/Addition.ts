import { Equation, EquationResult } from "../lib/types";
import { genAddSubSequence } from "./equationUtils";

class Addition extends Equation {
	minNum = 2;
	step = 3;

	constructor(maxNum: number, digitSize: number) {
		super(maxNum, digitSize);
	}

	gen = (): EquationResult => {
		const [answer, ...digits] = genAddSubSequence(
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
