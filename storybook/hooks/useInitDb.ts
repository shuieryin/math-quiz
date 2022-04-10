import { useEffect } from "react";
import { forEachRecord, initDb } from "../lib/DbHelper";
import { QuizReport } from "../lib/types";
import { milliToMinSec } from "../lib/utils";
import QuestionGenerator from "../lib/QuestionGenerator";

export default ({ name }: QuestionGenerator) => {
	useEffect(() => {
		(async () => {
			await initDb();

			const quizReports: QuizReport[] = [];
			let totalSize = 0;
			let totalCorrect = 0;
			let totalElapsed = 0;
			await forEachRecord<QuizReport>("quizReport", record => {
				const { quizName, totalCount, correctCount, elapsedMilli } = record;
				if (quizName === name) {
					quizReports.push(record);
					totalSize += totalCount;
					totalCorrect += correctCount;
					totalElapsed += elapsedMilli;
				}
			});

			if (quizReports.length > 0) {
				const accuracy = ((totalCorrect / totalSize) * 100).toFixed(2);
				const averageQuestionElapsedMilli = totalElapsed / totalSize;
				const {
					minutes: averageQuestionElapsedMinutes,
					seconds: averageQuestionElapsedSeconds
				} = milliToMinSec(averageQuestionElapsedMilli);

				console.log("==quizReports", quizReports);
				console.log("==accuracy", accuracy);
				console.log(
					"==averageQuestionElapsedMinutes",
					averageQuestionElapsedMinutes
				);
				console.log(
					"==averageQuestionElapsedSeconds",
					averageQuestionElapsedSeconds
				);
			}
		})();
	}, []);
};
