import { Equation, EquationResult } from "../lib/types";
import { genAddSubSequence } from "./equationUtils";
import { QuizId } from "../lib/QuestionGenerator";

class Subtraction extends Equation<string, number> {
	step = 2;

	genQuestion = (quizId: QuizId): EquationResult<string, number> => {
		const digits = genAddSubSequence(this.numberRanges, this.step);

		const answer = digits.pop();

		const questionContent = digits.join(" - ");

		return this.genQuestionWithState({
			quizId,
			questionContent,
			answer
		});
	};
}

export default Subtraction;
