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

export default ({ name, genQuestions }: QuestionGenerator) => {
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
					if (quizName === name) {
						incorrectQuestionToBeReused.push({
							questionContent,
							answer,
							isReuse: true,
							quizName
						});
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
		setQuestions(() => genQuestions(questionSize, incorrectQuestionToBeReused));
		setStartTime(new Date().getTime());

		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleSubmit = async () => {
		if (submitting || submitted) return;

		setSubmitting(true);

		const submitTime = new Date().getTime();

		let correctCount = 0;
		for (const question of questions) {
			const { answer, inputElement, questionContent, quizName } = question;

			const { value: inputAnswer } = inputElement;

			const existingIncorrectQuestion = (await getRecord(
				"incorrectQuestion",
				questionContent
			)) as IncorrectQuestion;

			const correct = inputAnswer === String(answer);
			if (correct) {
				correctCount++;

				// decrease incorrect question penalty count
				if (existingIncorrectQuestion) {
					existingIncorrectQuestion.count--;
					if (existingIncorrectQuestion.count <= 0) {
						await removeRecord("incorrectQuestion", questionContent);
					} else {
						await addRecord("incorrectQuestion", existingIncorrectQuestion);
					}
				}
			} else {
				// add incorrect question with penalty count
				const incorrectQuestion: IncorrectQuestion = {
					questionContent,
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
			quizName: name,
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
