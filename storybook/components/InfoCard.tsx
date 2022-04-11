import React, { FC, isValidElement } from "react";
import { DisplayType } from "../lib/types";

type Props = {
	header?: DisplayType;
	content?: DisplayType;
	bgColor?: string;
	hoverBgColor?: string;
	borderColor?: string;
	withoutBorder?: boolean;
};

const InfoCard: FC<Props> = ({
	header,
	content,
	bgColor,
	hoverBgColor,
	borderColor,
	withoutBorder
}) => {
	const body = (
		<>
			{header && (
				<h5 className="mb-2 text-3xl font-bold tracking-tight text-white">
					{header}
				</h5>
			)}
			{content &&
				(isValidElement(content) ? (
					content
				) : (
					<p className="font-normal text-2xl text-gray-300">{content}</p>
				))}
		</>
	);

	if (withoutBorder) {
		return body;
	} else {
		return (
			<div
				className={`w-full p-6 rounded-lg shadow-lg ${bgColor} hover:${hoverBgColor} border ${borderColor}`}
			>
				{body}
			</div>
		);
	}
};

InfoCard.defaultProps = {
	withoutBorder: false
};

export default InfoCard;
