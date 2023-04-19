import { Equation, EquationResult } from "../lib/types";
import { genDivRemSequence } from "./equationUtils";

class DivisionWithRem extends Equation {
	minNum = 1;

	genQuestion = (): EquationResult => {
		const { questionContent, quotient } = genDivRemSequence({
			dividendRange: { start: this.minNum, end: this.maxNum },
			divisorRange: { start: this.minNum, end: this.maxNum }
		});

		return this.genQuestionWithState({
			questionContent,
			answer: quotient
		});
	};
}

export default DivisionWithRem;
