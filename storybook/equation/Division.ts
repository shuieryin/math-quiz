import { Equation, EquationResult } from "../lib/types";
import { genMulDivSequence } from "./equationUtils";
import { QuizId } from "../lib/QuestionGenerator";

class Division extends Equation {
	genQuestion = (quizId: QuizId): EquationResult => {
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
