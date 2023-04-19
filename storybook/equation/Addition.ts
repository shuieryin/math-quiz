import { Equation, EquationResult } from "../lib/types";
import { genAddSubSequence } from "./equationUtils";

class Addition extends Equation {
	minNum = 2;
	step = 3;

	genQuestion = (): EquationResult => {
		const [answer, ...digits] = genAddSubSequence(
			this.digitSize,
			this.minNum,
			this.maxNum,
			this.step
		);
		return this.genQuestionWithState({
			questionContent: digits.join(" + "),
			answer
		});
	};
}

export default Addition;
