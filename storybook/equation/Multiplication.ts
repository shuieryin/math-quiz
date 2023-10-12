import { Equation, EquationResult } from "../lib/types";
import { genMulDivSequence } from "./equationUtils";
import { QuizId } from "../lib/QuestionGenerator";

class Multiplication extends Equation<string, number> {
	genQuestion = (quizId: QuizId): EquationResult<string, number> => {
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
