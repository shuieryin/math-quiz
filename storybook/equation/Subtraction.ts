import { Equation, EquationResult } from "../lib/types";
import { genAddSubSequence } from "./equationUtils";
import { QuizId } from "../lib/QuestionGenerator";

class Subtraction extends Equation {
	minNum = 2;
	step = 2;

	genQuestion = (quizId: QuizId): EquationResult => {
		const [answer, ...digits] = genAddSubSequence(
			this.digitSize,
			this.minNum,
			this.maxNum,
			this.step
		);

		const questionContent = digits.join(" - ");

		return this.genQuestionWithState({
			quizId,
			questionContent,
			answer
		});
	};
}

export default Subtraction;
