import { Equation, EquationResult } from "../lib/types";
import { genAddSubSequence } from "./equationUtils";
import { QuizId } from "../lib/QuestionGenerator";

class Addition extends Equation {
	minNum = 2;
	step = 3;

	genQuestion = (quizId: QuizId): EquationResult => {
		const [answer, ...digits] = genAddSubSequence(
			this.digitSize,
			this.minNum,
			this.maxNum,
			this.step
		);
		return this.genQuestionWithState({
			quizId,
			questionContent: digits.join(" + "),
			answer
		});
	};
}

export default Addition;
