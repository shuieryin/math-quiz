import React, { FC } from "react";
import { DisplayType, TailWindColorName } from "../lib/types";

type Props = {
	header?: DisplayType;
	content?: DisplayType;
	bgColor?: TailWindColorName;
	borderColor?: TailWindColorName;
};

const InfoCard: FC<Props> = ({ header, content, bgColor, borderColor }) => {
	return (
		<div
			className={`w-full p-6 rounded-lg shadow-lg bg-${bgColor}-100 hover:bg-${bgColor}-200 border border-${borderColor}-200 dark:bg-${borderColor}-800 dark:border-${borderColor}-700`}
		>
			{header && (
				<h5 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
					{header}
				</h5>
			)}
			{content && (
				<p className="font-normal text-2xl text-gray-700 dark:text-gray-400">
					{content}
				</p>
			)}
		</div>
	);
};

InfoCard.defaultProps = {
	bgColor: "orange",
	borderColor: "gray"
};

export default InfoCard;
