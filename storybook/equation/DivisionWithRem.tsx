import {
	DivisionRemAnswer,
	DoGenParams,
	Equation,
	EquationResult
} from "../lib/types";
import { genDefaultQuestion, genDivRemSequence } from "./equationUtils";
import React from "react";
import DivisionWithRemQuestionCard from "../components/DivisionWithRemQuestionCard";
import { sizeOfNumber } from "../lib/utils";

const { v4: uuidv4 } = require("uuid");

class DivisionWithRem extends Equation {
	minNum = 1;

	genQuestion = (quizId: string): EquationResult => {
		const divisorEnd = Math.max(
			1,
			Math.pow(10, sizeOfNumber(this.maxNum) - 1) - 1
		);
		const { quotient, remainder, dividend, divisor } = genDivRemSequence({
			dividendRange: { start: this.minNum, end: this.maxNum },
			divisorRange: {
				start: this.minNum,
				end: divisorEnd
			}
		});

		return this.genQuestionWithState({
			quizId,
			questionContent: { dividend, divisor },
			answer: { quotient, remainder }
		});
	};

	genQuestionWithState = (params: DoGenParams): EquationResult => {
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
		}: DivisionRemAnswer = {}) => {
			const { quotient, remainder } = question.answer as DivisionRemAnswer;
			return inputQuotient === quotient && inputRemainder === remainder;
		};
		return question;
	};
}

export default DivisionWithRem;
