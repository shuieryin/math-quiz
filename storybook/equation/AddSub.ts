import { Equation, EquationResult, NumberRange } from "../lib/types";
import { genAddSubVariants } from "./equationUtils";
import { QuizId } from "../lib/QuestionGenerator";

class Subtraction extends Equation {
	step = 2;

	constructor(numberRanges: NumberRange[]) {
		super(numberRanges);

		if (numberRanges.length === 2) {
			this.maxQuestionSize = 200;
		} else {
			this.maxQuestionSize = 500;
		}
	}

	genQuestion = (quizId: QuizId): EquationResult => {
		const {
			digits: [answer],
			questionContent
		} = genAddSubVariants(this.numberRanges, this.step);

		return this.genQuestionWithState({
			quizId,
			questionContent,
			answer
		});
	};
}

export default Subtraction;
