import { IncorrectQuestion, QuizReport } from "./types";
import { addRecord, forEachRecord, getUpgradeStore } from "./DbHelper";
import QuestionGenerator, { QuizId } from "./QuestionGenerator";

export type IncorrectQuestionV9 = Omit<IncorrectQuestion, "quizId"> & {
	quizName: QuizId;
};
export type QuizReportV9 = Omit<QuizReport, "quizId"> & { quizName: QuizId };

const migrateRecordQuizId = (
	record: IncorrectQuestion | QuizReport,
	questionGenerator: QuestionGenerator
): boolean => {
	let needMigrate = false;
	if (record.quizId === questionGenerator.getName()) {
		record.quizId = questionGenerator.getId();
		needMigrate = true;
	} else if (record.quizId?.endsWith("digits")) {
		record.quizId = record.quizId.replace("digits", "numbers") as QuizId;
		needMigrate = true;
	} else if (
		record.quizId === "grade-two_within-10k_division-rem_four-numbers"
	) {
		record.quizId = "grade-two_within-10k_division-rem_two-numbers";
		needMigrate = true;
	} else if (record.quizId === "grade-two_within-10k_division_four-numbers") {
		record.quizId = "grade-two_within-10k_division_two-numbers";
		needMigrate = true;
	}
	return needMigrate;
};

export const migrateQuizId = async (questionGenerator: QuestionGenerator) => {
	const incorrectQuestionsToBeUpdated = [];
	await forEachRecord<IncorrectQuestion>(
		"incorrectQuestion",
		async question => {
			if (migrateRecordQuizId(question, questionGenerator)) {
				incorrectQuestionsToBeUpdated.push(question);
			}
		}
	);
	for (const incorrectQuestionToBeUpdated of incorrectQuestionsToBeUpdated) {
		await addRecord("incorrectQuestion", incorrectQuestionToBeUpdated);
	}

	const quizReportsToBeUpdated = [];
	await forEachRecord<QuizReport>("quizReport", async quizReport => {
		if (migrateRecordQuizId(quizReport, questionGenerator)) {
			quizReportsToBeUpdated.push(quizReport);
		}
	});
	for (const quizReportToBeUpdated of quizReportsToBeUpdated) {
		await addRecord("quizReport", quizReportToBeUpdated);
	}
};

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
