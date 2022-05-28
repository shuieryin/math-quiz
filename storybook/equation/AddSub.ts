import { Equation, EquationResult } from "../lib/types";
import { genAddSubVariants } from "./equationUtils";

class Subtraction extends Equation {
	minNum = 2;
	step = 2;

	constructor(maxNum: number, digitSize: number) {
		super(maxNum, digitSize);

		if (digitSize === 2) {
			this.maxQuestionSize = 200;
		} else {
			this.maxQuestionSize = 500;
		}
	}

	gen = (): EquationResult => {
		const {
			digits: [answer],
			questionContent
		} = genAddSubVariants(this.digitSize, this.minNum, this.maxNum, this.step);

		return {
			questionContent,
			answer
		} as EquationResult;
	};
}

export default Subtraction;
