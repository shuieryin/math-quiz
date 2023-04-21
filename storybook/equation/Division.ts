import { Equation, EquationResult } from "../lib/types";
import { genMulDivSequence } from "./equationUtils";

class Division extends Equation {
	minNum = 2;

	genQuestion = (quizId: string): EquationResult => {
		const [answer, ...digits] = genMulDivSequence(
			this.digitSize,
			this.minNum,
			this.maxNum
		);
		digits.reverse();

		const questionContent = digits.join(" ÷ ");

		return this.genQuestionWithState({
			quizId,
			questionContent,
			answer
		});
	};
}

export default Division;
