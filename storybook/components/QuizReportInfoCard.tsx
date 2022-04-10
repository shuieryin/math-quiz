import InfoCard from "./InfoCard";
import React, { FC } from "react";
import { QuizReport } from "../lib/types";
import { milliToMinSec } from "../lib/utils";

type Props = {
	quizReport: QuizReport;
};

const QuizReportInfoCard: FC<Props> = ({
	quizReport: { correctCount, totalCount, elapsedMilli }
}) => {
	const { minutes: elapsedMinutes, seconds: elapsedSeconds } =
		milliToMinSec(elapsedMilli);

	return (
		<InfoCard
			header={`你答对了 ${correctCount} / ${totalCount} 题 !`}
			content={`用时 ${elapsedMinutes} 分 ${elapsedSeconds} 秒`}
		/>
	);
};

export default QuizReportInfoCard;
