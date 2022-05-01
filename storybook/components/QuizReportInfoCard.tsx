import InfoCard from "./InfoCard";
import React, { FC } from "react";
import { QuizReport } from "../lib/types";
import { formatDateTime, milliToMinSec } from "../lib/utils";
import Badge from "./Badge";
import nls from "../nls";

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
			header={nls.get("got-x-out-of-y-questions-right", {
				totalCorrect: String(correctCount),
				totalSize: String(totalCount)
			})}
			content={
				<>
					<div className="text-3xl text-gray-200">
						{nls.get("spent")} {elapsedMinutes} {nls.get("minutes")}{" "}
						{elapsedSeconds} {nls.get("seconds")}
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
