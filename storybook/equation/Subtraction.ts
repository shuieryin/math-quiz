import { Equation, EquationResult } from "../lib/types";
import { genAddSubSequence } from "./equationUtils";

class Subtraction extends Equation {
	minNum = 2;
	step = 2;

	genQuestion = (quizId: string): EquationResult => {
		const [answer, ...digits] = genAddSubSequence(
			this.digitSize,
			this.minNum,
			this.maxNum,
			this.step
		);

		const questionContent = digits.join(" - ");

		return this.genQuestionWithState({
			quizId,
			questionContent,
			answer
		});
	};
}

export default Subtraction;
