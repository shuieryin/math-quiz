import {
	DivisionRemAnswer,
	DivisionRemQuestion,
	DoGenParams,
	Equation,
	EquationResult
} from "../lib/types";
import { genDefaultQuestion, genDivRemSequence } from "./equationUtils";
import React from "react";
import DivisionWithRemQuestionCard from "../components/DivisionWithRemQuestionCard";
import { QuizId } from "../lib/QuestionGenerator";

import { v4 as uuidv4 } from "uuid";

class DivisionWithRem extends Equation<DivisionRemQuestion, DivisionRemAnswer> {
	genQuestion = (
		quizId: QuizId
	): EquationResult<DivisionRemQuestion, DivisionRemAnswer> => {
		const { quotient, remainder, dividend, divisor } = genDivRemSequence({
			dividendRange: this.numberRanges[0],
			divisorRange: this.numberRanges[1]
		});

		return this.genQuestionWithState({
			quizId,
			questionContent: { dividend, divisor },
			answer: { quotient, remainder }
		});
	};

	genQuestionWithState = (
		params: DoGenParams<DivisionRemQuestion, DivisionRemAnswer>
	): EquationResult<DivisionRemQuestion, DivisionRemAnswer> => {
		const question = genDefaultQuestion(params);

		question.genQuestionCard = submitted => (
			<DivisionWithRemQuestionCard
				key={`question-${uuidv4()}`}
				question={question}
				disabled={submitted}
			/>
		);
		question.handleSubmit = ({
			quotient: inputQuotient,
			remainder: inputRemainder
		} = {}) => {
			const { quotient, remainder } = question.answer;
			return inputQuotient === quotient && inputRemainder === remainder;
		};
		return question;
	};
}

export default DivisionWithRem;
