import React, { FC, useEffect } from "react";
import "./quiz-container.less";
import { Question } from "../lib/types";
import QuestionGenerator from "../lib/QuestionGenerator";
import { LoaderMedium } from "./Icons";
import QuizReportInfoCard from "./QuizReportInfoCard";
import QuizControl from "./QuizControl";
import QuestionCard from "./QuestionCard";
import useInitQuiz from "../hooks/useInitQuiz";
import useQuiz from "../hooks/useQuiz";

type Props = {
	questionGenerator: QuestionGenerator;
};

const QuizContainer: FC<Props> = ({ questionGenerator }) => {
	useInitQuiz();

	const {
		startQuiz,
		handleSubmit,
		questions,
		quizReport,
		submitting,
		submitted
	} = useQuiz(questionGenerator);

	useEffect(() => {
		const question: Question = questions[0];
		if (question?.inputElement instanceof HTMLInputElement) {
			question.inputElement.focus();
		}

		for (const { inputElement } of questions) {
			if (inputElement instanceof HTMLInputElement) {
				inputElement.value = "";
			}
		}
	}, [questions]);

	const questionElements = [];
	for (const question of questions) {
		const { questionContent } = question;
		questionElements.push(
			<QuestionCard
				key={`question-${questionContent}`}
				question={question}
				disabled={submitted}
			/>
		);
	}

	return (
		<div className="flex flex-col gap-y-5">
			{questionElements.length > 0 && (
				<div className="flex flex-col gap-y-5">
					<div className="flex xs:bg-gray-700 rounded-md">
						<div className="flex-1 max-w-5xl xss:p-5 xs:p-10">
							<div className="grid sm:grid-cols-1 md:grid-cols-2 grid-flow-row xss:gap-x-2 xs:gap-x-10 gap-y-20 auto-cols-max xss:justify-items-start xs:justify-items-center">
								{questionElements}
							</div>
						</div>
					</div>
					{!submitted && (
						<button
							className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 font-bold !text-3xl"
							onClick={handleSubmit}
							disabled={submitted}
						>
							提交答案
							{submitting && <LoaderMedium />}
						</button>
					)}
				</div>
			)}
			{quizReport && <QuizReportInfoCard quizReport={quizReport} />}
			{(questionElements.length === 0 || submitted) && (
				<QuizControl
					questionGenerator={questionGenerator}
					onStart={startQuiz}
					questions={questions}
				/>
			)}
		</div>
	);
};

export default QuizContainer;
