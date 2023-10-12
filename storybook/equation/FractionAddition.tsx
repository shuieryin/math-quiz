import {
	DoGenParams,
	Equation,
	EquationResult,
	Fraction,
	GenFractionItem
} from "../lib/types";
import { genDefaultQuestion, genFractionAddition } from "./equationUtils";
import React from "react";
import { QuizId } from "../lib/QuestionGenerator";

import { v4 as uuidv4 } from "uuid";
import FractionQuestionCard from "../components/FractionQuestionCard";

class FractionAddition extends Equation<Fraction[], Fraction> {
	genQuestion = (quizId: QuizId): EquationResult<Fraction[], Fraction> => {
		const genFractionItems: GenFractionItem[] = [];
		for (let i = 0; i < this.numberRanges.length; i = i + 2) {
			genFractionItems.push({
				numeratorRange: this.numberRanges[i],
				denominatorRange: this.numberRanges[i + 1]
			});
		}

		const [answer, ...questionContent] = genFractionAddition(
			genFractionItems,
			this.options
		);

		return this.genQuestionWithState({
			quizId,
			questionContent,
			answer
		});
	};

	genQuestionWithState = (
		params: DoGenParams<Fraction[], Fraction>
	): EquationResult<Fraction[], Fraction> => {
		const question = genDefaultQuestion(params);

		question.genQuestionCard = submitted => (
			<FractionQuestionCard
				key={`question-${uuidv4()}`}
				question={question}
				operator="+"
				disabled={submitted}
			/>
		);
		question.handleSubmit = ({
			numerator: inputNumerator,
			denominator: inputDenominator
		}) => {
			const { numerator, denominator } = question.answer;
			return inputNumerator === numerator && inputDenominator === denominator;
		};
		return question;
	};
}

export default FractionAddition;
