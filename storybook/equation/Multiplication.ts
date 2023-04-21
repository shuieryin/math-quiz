import { Equation, EquationResult } from "../lib/types";
import { genMulDivSequence } from "./equationUtils";

class Multiplication extends Equation {
	minNum = 2;

	genQuestion = (quizId: string): EquationResult => {
		const digits = genMulDivSequence(this.digitSize, this.minNum, this.maxNum);
		const answer = digits.pop();

		const questionContent = digits.join(" × ");

		return this.genQuestionWithState({
			quizId,
			questionContent,
			answer
		});
	};
}

export default Multiplication;
