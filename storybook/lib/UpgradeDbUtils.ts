import { IncorrectQuestion, QuizReport } from "./types";
import { addRecord, forEachRecord, getUpgradeStore } from "./DbHelper";

export type IncorrectQuestionV9 = Omit<IncorrectQuestion, "quizId"> & {
	quizName: string;
};
export type QuizReportV9 = Omit<QuizReport, "quizId"> & { quizName: string };

export const V9_TO_V10 = async (event: IDBVersionChangeEvent) => {
	const { target, oldVersion } = event;
	if (oldVersion > 0 && oldVersion <= 9) {
		const upgradeTransaction = target["transaction"] as IDBTransaction;
		const incorrectQuestionStore = getUpgradeStore(
			upgradeTransaction,
			"incorrectQuestion"
		);
		incorrectQuestionStore.deleteIndex("quizName");
		incorrectQuestionStore.createIndex("quizId", "quizId", {
			unique: false
		});

		const quizReportStore = getUpgradeStore(upgradeTransaction, "quizReport");
		quizReportStore.deleteIndex("quizName");
		quizReportStore.createIndex("quizId", "quizId", {
			unique: false
		});

		const incorrectQuestionsToBeUpdated: IncorrectQuestion[] = [];
		await forEachRecord<IncorrectQuestionV9>(
			"incorrectQuestion",
			({ quizName, ...restProps }) => {
				incorrectQuestionsToBeUpdated.push({
					...restProps,
					quizId: quizName
				});
			}
		);
		for (const incorrectQuestionToBeUpdated of incorrectQuestionsToBeUpdated) {
			await addRecord("incorrectQuestion", incorrectQuestionToBeUpdated);
		}

		const quizReportsToBeUpdated: QuizReport[] = [];
		await forEachRecord<QuizReportV9>(
			"quizReport",
			({ quizName, ...restProps }) => {
				quizReportsToBeUpdated.push({
					...restProps,
					quizId: quizName
				});
			}
		);
		for (const quizReportToBeUpdated of quizReportsToBeUpdated) {
			await addRecord("quizReport", quizReportToBeUpdated);
		}
	}
};
