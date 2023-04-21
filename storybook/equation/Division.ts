import { Equation, EquationResult } from "../lib/types";
import { genMulDivSequence } from "./equationUtils";
import { QuizId } from "../lib/QuestionGenerator";

class Division extends Equation {
	minNum = 2;

	genQuestion = (quizId: QuizId): EquationResult => {
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
