import { Equation, EquationResult } from "../lib/types";
import { genMulDivSequence } from "./equationUtils";

class Division extends Equation {
	minNum = 2;

	genQuestion = (): EquationResult => {
		const [answer, ...digits] = genMulDivSequence(
			this.digitSize,
			this.minNum,
			this.maxNum
		);
		digits.reverse();

		const questionContent = digits.join(" ÷ ");

		return this.genQuestionWithState({
			questionContent,
			answer
		});
	};
}

export default Division;
