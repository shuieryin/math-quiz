import React, { FunctionComponent, ReactNode } from "react";

type Props = {
	color?:
		| "default"
		| "dark"
		| "white"
		| "red"
		| "green"
		| "yellow"
		| "indigo"
		| "purple"
		| "pink";
	textSize?: string;
	children: ReactNode;
};

const Badge: FunctionComponent<Props> = ({ color, textSize, children }) => {
	let colorClassName, textColorClassName;
	switch (color) {
		case "dark":
			colorClassName = "bg-gray-700";
			textColorClassName = "text-gray-300";
			break;
		case "red":
			colorClassName = "bg-red-200";
			textColorClassName = "text-red-900";
			break;
		case "green":
			colorClassName = "bg-green-200";
			textColorClassName = "text-green-900";
			break;
		case "yellow":
			colorClassName = "bg-yellow-200";
			textColorClassName = "text-yellow-900";
			break;
		case "indigo":
			colorClassName = "bg-indigo-200";
			textColorClassName = "text-indigo-900";
			break;
		case "purple":
			colorClassName = "bg-purple-200";
			textColorClassName = "text-purple-900";
			break;
		case "pink":
			colorClassName = "bg-pink-200";
			textColorClassName = "text-pink-900";
			break;
		default:
			colorClassName = "bg-blue-200";
			textColorClassName = "text-blue-800";
	}

	return (
		<span
			className={`font-semibold mr-2 px-2.5 py-0.5 rounded ${textSize} ${colorClassName} ${textColorClassName}`}
		>
			{children}
		</span>
	);
};

Badge.defaultProps = {
	color: "default",
	textSize: "text-2xl"
};

export default Badge;
