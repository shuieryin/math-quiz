import { Equation, EquationResult } from "../lib/types";
import { genMulDivSequence } from "./equationUtils";

class Multiplication extends Equation {
	minNum = 2;

	constructor(maxNum: number, digitSize: number) {
		super(maxNum, digitSize);
	}

	gen = (): EquationResult => {
		const digits = genMulDivSequence(this.digitSize, this.minNum, this.maxNum);
		const answer = digits.pop();

		const questionContent = digits.join(" × ");

		return {
			questionContent,
			answer
		} as EquationResult;
	};
}

export default Multiplication;
