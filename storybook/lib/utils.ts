import { QuizReport } from "./types";

export const defaultDocParams = () => ({
	viewMode: "docs",
	previewTabs: {
		canvas: {
			hidden: true
		}
	}
});

export const randInt = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const firstEntry = (obj = {}) => {
	// noinspection LoopStatementThatDoesntLoopJS
	for (const key in obj) {
		return [key, obj[key]];
	}
};

export const randBool = () => Math.random() >= 0.5;

export const milliToMinSec = (milli: number) => {
	const minutes = Math.floor(milli / (60 * 1000));
	const seconds = ((milli % (60 * 1000)) / 1000).toFixed(2);

	return { minutes, seconds };
};

export const formatDateTime = (milliTime: number, noSec = false) => {
	const date = new Date(milliTime);
	return `${date.getFullYear()}年${
		date.getMonth() + 1
	}月${date.getDate()}日 ${date.getHours()}时${date.getMinutes()}分${
		noSec ? "" : `${date.getSeconds()}秒`
	}`;
};

export const quizReportAccuracyRate = ({
	correctCount,
	totalCount
}: QuizReport) => (totalCount > 0 ? (correctCount / totalCount) * 100 : 0);

export const quizReportColor = (quizReport: QuizReport) => {
	const accuracyRate = quizReportAccuracyRate(quizReport);
	return accuracyRateColor(accuracyRate);
};

export const accuracyRateColor = (accuracyRate: number) => {
	let bgColor;
	if (accuracyRate < 40) {
		bgColor = "bg-red-900";
	} else if (accuracyRate >= 40 && accuracyRate < 60) {
		bgColor = "bg-orange-800";
	} else if (accuracyRate >= 60 && accuracyRate < 65) {
		bgColor = "bg-yellow-600";
	} else if (accuracyRate >= 65 && accuracyRate < 70) {
		bgColor = "bg-yellow-400";
	} else if (accuracyRate >= 70 && accuracyRate < 75) {
		bgColor = "bg-lime-800";
	} else if (accuracyRate >= 75 && accuracyRate < 80) {
		bgColor = "bg-lime-700";
	} else if (accuracyRate >= 80 && accuracyRate < 85) {
		bgColor = "bg-green-800";
	} else if (accuracyRate >= 85 && accuracyRate < 90) {
		bgColor = "bg-green-700";
	} else if (accuracyRate >= 90 && accuracyRate < 95) {
		bgColor = "bg-blue-900";
	} else if (accuracyRate >= 95 && accuracyRate < 98) {
		bgColor = "bg-blue-800";
	} else if (accuracyRate >= 98 && accuracyRate < 99) {
		bgColor = "bg-teal-600";
	} else if (accuracyRate >= 99 && accuracyRate < 100) {
		bgColor = "bg-teal-500";
	} else if (accuracyRate >= 100) {
		bgColor = "bg-cyan-500";
	}

	return bgColor;
};
