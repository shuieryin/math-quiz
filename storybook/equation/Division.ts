import { Equation, EquationResult } from "../lib/types";
import { genMulDivSequence } from "./equationUtils";
import { QuizId } from "../lib/QuestionGenerator";

class Division extends Equation<string, number> {
	genQuestion = (quizId: QuizId): EquationResult<string, number> => {
		const [answer, ...digits] = genMulDivSequence(this.numberRanges);
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
