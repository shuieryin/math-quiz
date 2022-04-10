import React, { FC } from "react";
import { DisplayType } from "../lib/types";

type Props = {
	header?: DisplayType;
	content?: DisplayType;
	bgColor?: string;
	hoverBgColor?: string;
	borderColor?: string;
};

const InfoCard: FC<Props> = ({
	header,
	content,
	bgColor,
	hoverBgColor,
	borderColor
}) => {
	return (
		<div
			className={`w-full p-6 rounded-lg shadow-lg ${bgColor} hover:${hoverBgColor} border ${borderColor}`}
		>
			{header && (
				<h5 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
					{header}
				</h5>
			)}
			{content && (
				<p className="font-normal text-2xl text-gray-700">{content}</p>
			)}
		</div>
	);
};

InfoCard.defaultProps = {
	bgColor: "bg-orange-100",
	hoverBgColor: "bg-orange-200",
	borderColor: "border-gray-200"
};

export default InfoCard;
