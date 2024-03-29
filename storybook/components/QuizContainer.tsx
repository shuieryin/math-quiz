import React, { FunctionComponent, useEffect } from "react";
import "./quiz-container.less";
import QuestionGenerator from "../lib/QuestionGenerator";
import { LoaderMedium } from "./Icons";
import QuizReportInfoCard from "./QuizReportInfoCard";
import QuizControl from "./QuizControl";
import useQuiz from "../hooks/useQuiz";
import { quizReportColor } from "../lib/utils";
import nls from "../nls";
import PopupModal from "./PopupModal";
import YesNoModalContent from "./YesNoModalContent";

type Props = {
	questionGenerator: QuestionGenerator;
};

const QuizContainer: FunctionComponent<Props> = ({ questionGenerator }) => {
	const {
		startQuiz,
		exitQuiz,
		handleSubmit,
		questions,
		quizReport,
		submitting,
		submitted
	} = useQuiz(questionGenerator);

	useEffect(() => {
		// strangely a fixed height is generated only in Firefox, so unset it to fix the display issue
		const containerElement = document.getElementsByClassName(
			"innerZoomElementWrapper"
		)[0]?.parentNode;
		if (containerElement instanceof HTMLDivElement) {
			containerElement.style.height = "unset";
		}
	}, []);

	useEffect(() => {
		questions?.[0]?.focusInput();
	}, [questions]);

	const questionElements: JSX.Element[] = [];
	for (const question of questions) {
		questionElements.push(question.genQuestionCard(submitted));
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
						<div className="flex justify-evenly">
							<PopupModal
								initTrigger={setIsShowModal => (
									<button
										className="w-1/2 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-lg px-5 py-2.5 mr-2 mb-2 font-bold !text-3xl select-none"
										onClick={() => setIsShowModal(true)}
										disabled={submitted}
									>
										{nls.get("submit-answer")}
										{submitting && <LoaderMedium />}
									</button>
								)}
								initContent={setIsShowModal => (
									<YesNoModalContent
										bodyContent={
											<>
												<p className="text-2xl font-semibold">
													{nls.get("confirm-submit-answers")}
												</p>
												<p>{nls.get("make-sure-check-answers")}</p>
											</>
										}
										onYes={handleSubmit}
										onNo={() => setIsShowModal(false)}
									/>
								)}
							/>
							<PopupModal
								initTrigger={setIsShowModal => (
									<button
										className="w-5/12 focus:outline-none text-white bg-gray-700 hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 rounded-lg px-5 py-2.5 mr-2 mb-2 font-bold !text-3xl select-none"
										onClick={() => setIsShowModal(true)}
										disabled={submitted}
									>
										{nls.get("exit-quiz")}
										{submitting && <LoaderMedium />}
									</button>
								)}
								initContent={setIsShowModal => (
									<YesNoModalContent
										bodyContent={
											<p className="text-2xl font-semibold">
												{nls.get("confirm-exit-quiz")}
											</p>
										}
										onYes={() => {
											exitQuiz();
											setIsShowModal(false);
										}}
										onNo={() => setIsShowModal(false)}
									/>
								)}
							/>
						</div>
					)}
				</div>
			)}
			{quizReport && (
				<QuizReportInfoCard
					bgColor={quizReportColor(quizReport)}
					quizReport={quizReport}
				/>
			)}
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
