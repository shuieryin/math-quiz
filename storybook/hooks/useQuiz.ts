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
			async ({ questionContent, answer, quizName }) => {
				if (!quizName) {
					incorrectQuestionsNeedRemove.push(questionContent);
				} else {
					if (quizName === questionGenerator.getId()) {
						incorrectQuestionToBeReused.push(
							questionGenerator.genQuestion({
								questionContent: marshalQuestionContent(questionContent),
								answer,
								isReuse: true
							})
						);
					}
				}
			}
		);

		// remove old records that have no quizName
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
			const { answer, inputAnswer, questionContent, quizName } = question;

			const existingIncorrectQuestion = await getRecord<IncorrectQuestion>(
				"incorrectQuestion",
				unmarshalQuestionContent(questionContent)
			);

			const correct = question.handleSubmit(inputAnswer);
			if (correct) {
				correctCount++;

				// decrease incorrect question penalty count
				if (existingIncorrectQuestion) {
					existingIncorrectQuestion.count--;
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
					questionContent: unmarshalQuestionContent(questionContent),
					answer,
					quizName
				};

				if (existingIncorrectQuestion) {
					const { count = 0 } = existingIncorrectQuestion;
					incorrectQuestion.count = incorrectQuestionPenalty + count;
				} else {
					incorrectQuestion.count = incorrectQuestionPenalty;
				}
				await addRecord("incorrectQuestion", incorrectQuestion);
			}
			question.correct = correct;
		}

		const quizReport: QuizReport = {
			quizName: questionGenerator.getId(),
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

	return {
		questions,
		startQuiz,
		handleSubmit,
		quizReport,
		submitting,
		submitted
	};
};
