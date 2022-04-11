import React, { FC, useEffect, useState } from "react";
import QuestionGenerator from "../lib/QuestionGenerator";
import { Questions, QuizReport, QuizSummary } from "../lib/types";
import InfoCard from "./InfoCard";
import { milliToMinSec } from "../lib/utils";
import { forEachRecord } from "../lib/DbHelper";
import Accordion from "./Accordion";

export type OnStart = (questionSize: number) => void | Promise<void>;

type Props = {
	questionGenerator: QuestionGenerator;
	questions: Questions;
	onStart: OnStart;
};

const QuizControl: FC<Props> = ({ questionGenerator, onStart, questions }) => {
	const questionSizes = questionGenerator.questionSizes();
	const [questionSize, setQuestionSize] = useState(questionSizes[1]);
	const [quizSummary, setQuizSummary] = useState<QuizSummary>({
		totalCorrect: 0,
		totalSize: 0,
		perQuestionTookMilli: 0
	});

	useEffect(() => {
		(async () => {
			const existingQuizReports: QuizReport[] = [];
			let totalSize = 0;
			let totalCorrect = 0;
			let totalElapsed = 0;
			await forEachRecord<QuizReport>("quizReport", record => {
				const { quizName, totalCount, correctCount, elapsedMilli } = record;
				if (quizName === questionGenerator.name) {
					existingQuizReports.push(record);
					totalSize += totalCount;
					totalCorrect += correctCount;
					totalElapsed += elapsedMilli;
				}
			});

			if (existingQuizReports.length > 0) {
				const perQuestionTookMilli = totalElapsed / totalSize;

				const quizSummary: QuizSummary = {
					totalCorrect,
					totalSize,
					perQuestionTookMilli
				};
				setQuizSummary(quizSummary);
			}
		})();
	}, [questions]);

	const { perQuestionTookMilli, totalCorrect, totalSize } = quizSummary;
	const {
		minutes: averageQuestionElapsedMinutes,
		seconds: averageQuestionElapsedSeconds
	} = milliToMinSec(perQuestionTookMilli);
	const accuracy =
		totalSize > 0 ? ((totalCorrect / totalSize) * 100).toFixed(2) : 0;

	return (
		<div>
			<Accordion
				open={true}
				first={true}
				content={
					<div className="flex flex-row flex-nowrap gap-x-5 items-center !text-3xl">
						<select
							className="rounded-md shadow-lg form-select form-select-sm px-2 py-1 !text-3xl font-normal text-gray-700 bg-clip-padding bg-no-repeat border border-solid transition ease-in-out m-0 bg-gray-400 hover:bg-gray-500 border-none text-gray-900"
							value={questionSize}
							onChange={e => setQuestionSize(Number(e.target.value))}
						>
							{questionSizes.map(size => (
								<option key={`question-size-${size}`} value={size}>
									{size} 题
								</option>
							))}
						</select>
						<button
							className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 font-bold !text-3xl"
							onClick={async () => await onStart(questionSize)}
						>
							重新开始
						</button>
					</div>
				}
			/>
			<Accordion
				last={true}
				header="数据总结"
				content={
					<InfoCard
						withoutBorder={true}
						header={`你总共答对了 ${totalCorrect} / ${totalSize} 题 !`}
						content={
							<>
								<p className="text-2xl">正确率 {accuracy}%</p>
								<p className="text-2xl">
									平均每题用时 {averageQuestionElapsedMinutes} 分{" "}
									{averageQuestionElapsedSeconds} 秒
								</p>
							</>
						}
					/>
				}
			/>
		</div>
	);
};

QuizControl.defaultProps = {
	onStart: () => {}
};

export default QuizControl;
