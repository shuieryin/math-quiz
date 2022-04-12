import InfoCard from "./InfoCard";
import React, { FC } from "react";
import { QuizReport } from "../lib/types";
import { formatDateTime, milliToMinSec } from "../lib/utils";
import Badge from "./Badge";

type Props = {
	quizReport: QuizReport;
	bgColor?: string;
	withoutBorder?: boolean;
};

const QuizReportInfoCard: FC<Props> = ({
	quizReport: { correctCount, totalCount, elapsedMilli, createTime },
	bgColor,
	withoutBorder
}) => {
	const { minutes: elapsedMinutes, seconds: elapsedSeconds } =
		milliToMinSec(elapsedMilli);

	return (
		<InfoCard
			withoutBorder={withoutBorder}
			bgColor={bgColor}
			header={`你答对了 ${correctCount} / ${totalCount} 题 !`}
			content={
				<>
					<div className="text-3xl text-gray-300">
						用时 {elapsedMinutes} 分 {elapsedSeconds} 秒
					</div>
					<div className="sm:absolute right-6 top-6">
						<Badge color="dark" textSize="text-sm">
							{formatDateTime(createTime, true)}
						</Badge>
					</div>
				</>
			}
		/>
	);
};

QuizReportInfoCard.defaultProps = {
	withoutBorder: false
};

export default QuizReportInfoCard;
