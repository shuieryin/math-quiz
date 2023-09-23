import { useState } from "react";
import {
	addRecord,
	forEachRecord,
	getRecord,
	removeRecord
} from "../lib/DbHelper";
import {
	IncorrectQuestion,
	incorrectQuestionPenalty,
	Questions,
	QuizReport
} from "../lib/types";
import QuestionGenerator from "../lib/QuestionGenerator";
import { OnStart } from "../components/QuizControl";
import { marshalQuestionContent, unmarshalQuestionContent } from "../lib/utils";

export default (questionGenerator: QuestionGenerator) => {
	const [questions, setQuestions] = useState<Questions>([]);
	const [startTime, setStartTime] = useState(0);
	const [quizReport, setQuizReport] = useState<QuizReport>();
	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const startQuiz: OnStart = async questionSize => {
		const incorrectQuestionToBeReused: Questions = [];
		const incorrectQuestionsNeedRemove: string[] = [];
		await forEachRecord<IncorrectQuestion>(
			"incorrectQuestion",
			async ({ questionContent, answer, quizId }) => {
				if (!quizId) {
					incorrectQuestionsNeedRemove.push(questionContent);
				} else {
					if (quizId === questionGenerator.getId()) {
						incorrectQuestionToBeReused.push(
							questionGenerator.genQuestion({
								quizId,
								questionContent: marshalQuestionContent(questionContent),
								answer,
								isReuse: true
							})
						);
					}
				}
			}
		);

		// remove old records which quizId not found
		for (const questionNeedRemove of incorrectQuestionsNeedRemove) {
			await removeRecord("incorrectQuestion", questionNeedRemove);
		}

		setSubmitted(false);
		setQuizReport(undefined);
		setQuestions(() =>
			questionGenerator.genQuestions(questionSize, incorrectQuestionToBeReused)
		);
		setStartTime(new Date().getTime());

		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleSubmit = async () => {
		if (submitting || submitted) return;

		setSubmitting(true);

		const submitTime = new Date().getTime();

		let correctCount = 0;
		for (const question of questions) {
			const { answer, inputAnswer, questionContent, quizId } = question;

			const existingIncorrectQuestion = await getRecord<IncorrectQuestion>(
				"incorrectQuestion",
				unmarshalQuestionContent(questionContent)
			);

			const correct = question.handleSubmit(inputAnswer);
			if (correct) {
				correctCount++;

				// decrease incorrect question penalty count
				if (existingIncorrectQuestion) {
					if (existingIncorrectQuestion.count > 3) {
						existingIncorrectQuestion.count = 2;
					} else {
						existingIncorrectQuestion.count--;
					}
					if (existingIncorrectQuestion.count <= 0) {
						await removeRecord(
							"incorrectQuestion",
							unmarshalQuestionContent(questionContent)
						);
					} else {
						await addRecord("incorrectQuestion", existingIncorrectQuestion);
					}
				}
			} else {
				// add incorrect question with penalty count
				const incorrectQuestion: IncorrectQuestion = {
					quizId,
					questionContent: unmarshalQuestionContent(questionContent),
					answer
				};

				incorrectQuestion.count = incorrectQuestionPenalty;
				await addRecord("incorrectQuestion", incorrectQuestion);
			}
			question.correct = correct;
		}

		const quizReport: QuizReport = {
			quizId: questionGenerator.getId(),
			correctCount,
			totalCount: questions.length,
			createTime: Date.now(),
			elapsedMilli: submitTime - startTime
		};
		await addRecord("quizReport", quizReport);

		setQuizReport(quizReport);
		setSubmitting(false);
		setSubmitted(true);
	};

	const exitQuiz = () => {
		setSubmitted(false);
		setQuizReport(undefined);
		setQuestions([]);
		setStartTime(0);
	};

	return {
		questions,
		startQuiz,
		exitQuiz,
		handleSubmit,
		quizReport,
		submitting,
		submitted
	};
};
