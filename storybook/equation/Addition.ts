import { Equation, EquationResult } from "../lib/types";
import { genAddSubSequence } from "./equationUtils";
import { QuizId } from "../lib/QuestionGenerator";

class Addition extends Equation<string, number> {
	step = 3;

	genQuestion = (quizId: QuizId): EquationResult<string, number> => {
		const [answer, ...digits] = genAddSubSequence(this.numberRanges, this.step);
		return this.genQuestionWithState({
			quizId,
			questionContent: digits.join(" + "),
			answer
		});
	};
}

export default Addition;
