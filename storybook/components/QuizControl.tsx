import React, { FC, useEffect, useState } from "react";
import QuestionGenerator from "../lib/QuestionGenerator";
import { Questions, QuizReport, QuizSummary } from "../lib/types";
import InfoCard from "./InfoCard";
import {
	accuracyRateColor,
	milliToMinSec,
	quizReportColor
} from "../lib/utils";
import { forEachRecord, initDb } from "../lib/DbHelper";
import Accordion from "./Accordion";
import QuizReportInfoCard from "./QuizReportInfoCard";
import nls from "../nls";

export type OnStart = (questionSize: number) => void | Promise<void>;

type Props = {
	questionGenerator: QuestionGenerator;
	questions: Questions;
	onStart: OnStart;
};

const QuizControl: FC<Props> = ({ questionGenerator, onStart, questions }) => {
	const questionSizes = questionGenerator.questionSizes();
	const [questionSize, setQuestionSize] = useState(questionSizes[1]);
	const [quizSummary, setQuizSummary] = useState<QuizSummary>();
	const [quizReports, setQuizReports] = useState<QuizReport[]>([]);
	const [openHistory, setOpenHistory] = useState(false);

	useEffect(() => {
		(async () => {
			await initDb();
			const quizReports: QuizReport[] = [];
			let totalSize = 0;
			let totalCorrect = 0;
			let totalElapsed = 0;
			await forEachRecord<QuizReport>("quizReport", quizReport => {
				const { quizName, totalCount, correctCount, elapsedMilli } = quizReport;
				if (quizName === questionGenerator.name) {
					quizReports.push(quizReport);
					totalSize += totalCount;
					totalCorrect += correctCount;
					totalElapsed += elapsedMilli;
				}
			});

			if (quizReports.length > 0) {
				const perQuestionTookMilli = totalElapsed / totalSize;

				const quizSummary: QuizSummary = {
					totalCorrect,
					totalSize,
					perQuestionTookMilli
				};
				quizReports.reverse();
				setQuizSummary(quizSummary);
				setQuizReports(quizReports);
			}
		})();
	}, [questions]);

	let quizSummaryElement, accuracyRate;
	if (quizSummary) {
		const { perQuestionTookMilli, totalCorrect, totalSize } = quizSummary;
		const {
			minutes: averageQuestionElapsedMinutes,
			seconds: averageQuestionElapsedSeconds
		} = milliToMinSec(perQuestionTookMilli);
		accuracyRate = totalSize > 0 ? (totalCorrect / totalSize) * 100 : 0;

		quizSummaryElement = (
			<InfoCard
				withoutBorder={true}
				header={nls.get("got-x-out-of-y-questions-right", {
					totalCorrect: String(totalCorrect),
					totalSize: String(totalSize)
				})}
				content={
					<>
						<p className="text-2xl text-gray-200">
							{nls.get("accuracy-rate")} {accuracyRate.toFixed(2)}%
						</p>
						<p className="text-2xl text-gray-200">
							{nls.get("per-question-spent")} {averageQuestionElapsedMinutes}{" "}
							{nls.get("minutes")} {averageQuestionElapsedSeconds}{" "}
							{nls.get("seconds")}
						</p>
					</>
				}
			/>
		);
	}

	return (
		<div>
			<Accordion
				open={true}
				first={true}
				last={!quizSummary}
				content={
					<div className="flex flex-row flex-nowrap gap-x-5 items-center">
						<select
							className="rounded-md shadow-lg form-select form-select-sm px-2 py-1 text-3xl font-normal text-gray-700 bg-clip-padding bg-no-repeat border border-solid transition ease-in-out m-0 bg-gray-400 hover:bg-gray-500 border-none text-gray-900"
							value={questionSize}
							onChange={e => setQuestionSize(Number(e.target.value))}
						>
							{questionSizes.map(size => (
								<option key={`question-size-${size}`} value={size}>
									{size} {nls.get("question-unit")}
								</option>
							))}
						</select>
						<button
							className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 font-bold !text-3xl"
							onClick={async () => await onStart(questionSize)}
						>
							{nls.get("start-quiz")}
						</button>
					</div>
				}
			/>
			{quizSummary && (
				<Accordion
					header={nls.get("quiz-summary")}
					bgColor={accuracyRateColor(accuracyRate)}
					content={quizSummaryElement}
					last={quizReports.length === 0}
				/>
			)}
			{quizReports.length > 0 && (
				<Accordion
					header={nls.get("quiz-history")}
					last={true}
					onOpen={open => setOpenHistory(open)}
				/>
			)}
			{quizReports.map((quizReport, i) => {
				const { createTime } = quizReport;
				return (
					<Accordion
						key={`quiz-${createTime}`}
						open={openHistory}
						last={quizReports.length - 1 === i}
						bgColor={quizReportColor(quizReport)}
						content={
							<QuizReportInfoCard
								withoutBorder={true}
								quizReport={quizReport}
							/>
						}
					/>
				);
			})}
		</div>
	);
};

QuizControl.defaultProps = {
	onStart: () => {}
};

export default QuizControl;
