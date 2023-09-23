import { Equation, EquationResult } from "../lib/types";
import { genMulDivSequence } from "./equationUtils";
import { QuizId } from "../lib/QuestionGenerator";

class Multiplication extends Equation {
	genQuestion = (quizId: QuizId): EquationResult => {
		const digits = genMulDivSequence(this.numberRanges);
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
