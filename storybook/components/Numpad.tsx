import React, { FC, ReactElement } from "react";
import { Backspace, Enter } from "./Icons";

type OnClickFnName = "Enter" | "Backspace";
type OnClickValue =
	| "1"
	| "2"
	| "3"
	| "4"
	| "5"
	| "6"
	| "7"
	| "8"
	| "9"
	| "0"
	| OnClickFnName;
type Props = {
	onClick?: (value: OnClickValue) => void;
};

type ButtonType = "numeric" | "function";

type ButtonConfig = {
	name?: OnClickValue;
	content: OnClickValue | ReactElement;
	type: ButtonType;
};

const buttonConfigs: ButtonConfig[] = [
	{
		content: "7",
		type: "numeric"
	},
	{
		content: "8",
		type: "numeric"
	},
	{
		content: "9",
		type: "numeric"
	},
	{
		name: "Backspace",
		content: Backspace(),
		type: "function"
	},
	{
		content: "4",
		type: "numeric"
	},
	{
		content: "5",
		type: "numeric"
	},
	{
		content: "6",
		type: "numeric"
	},
	{
		content: "0",
		type: "numeric"
	},
	{
		content: "1",
		type: "numeric"
	},
	{
		content: "2",
		type: "numeric"
	},
	{
		content: "3",
		type: "numeric"
	},
	{
		name: "Enter",
		content: Enter(),
		type: "function"
	}
];

const Numpad: FC<Props> = ({ onClick }) => {
	const buttons = [];
	for (const buttonConfig of buttonConfigs) {
		const { type, content } = buttonConfig;
		switch (type) {
			case "numeric":
				buttons.push(
					<div
						tabIndex={-1}
						key={`numpad_${content}`}
						className="text-4xl text-white font-semibold bg-zinc-700 rounded-lg flex items-center justify-center cursor-pointer"
						onClick={() => onClick(content as OnClickValue)}
					>
						{content}
					</div>
				);
				break;
			case "function": {
				const { name } = buttonConfig;
				buttons.push(
					<div
						tabIndex={-1}
						key={`numpad_${name}`}
						className="text-4xl text-white font-semibold bg-zinc-700 rounded-lg p-3 cursor-pointer"
						onClick={() => onClick(name)}
					>
						{content}
					</div>
				);
			}
		}
	}

	return (
		<div className="w-72 h-56 bg-gray-500 rounded-lg grid grid-cols-4 grid-rows-3 gap-2 p-2">
			{buttons}
		</div>
	);
};

export default Numpad;
