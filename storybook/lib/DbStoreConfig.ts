import { StoreConfig } from "./types";

export const incorrectQuestionStoreConfig: StoreConfig = {
	name: "incorrectQuestion",
	options: { keyPath: "questionContent" },
	indexes: {
		questionContent: { unique: true },
		answer: { unique: false },
		count: { unique: false },
		quizId: { unique: false }
	}
};

export const quizReportStoreConfig: StoreConfig = {
	name: "quizReport",
	options: { keyPath: "createTime" },
	indexes: {
		createTime: { unique: true },
		quizId: { unique: false },
		correctCount: { unique: false },
		totalCount: { unique: false },
		elapsedMilli: { unique: false }
	}
};
