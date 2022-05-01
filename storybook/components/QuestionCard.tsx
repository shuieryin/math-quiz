import React, { FC, useState } from "react";
import { clearInputPressedMilliThreshold, Question } from "../lib/types";
import { CheckCircle, Exclamation, XCircle } from "./Icons";
import Tooltip from "./Tooltip";
import nls from "../nls";

type Props = {
	question: Question;
	disabled?: boolean;
};

const QuestionCard: FC<Props> = ({ question, disabled }) => {
	const { correct, questionContent, isReuse } = question;
	const [keyDownStartTime, setKeyDownStartTime] = useState<number>();

	let inputBoxBgColor, topLeftIcon;
	if (correct === true) {
		inputBoxBgColor = "bg-green-700";
		topLeftIcon = (
			<div className="absolute h-8 w-8 -left-4 -top-4">
				{CheckCircle(
					"text-green-700 bg-gray-400 rounded-full dark:text-green-400"
				)}
			</div>
		);
	} else if (correct === false) {
		inputBoxBgColor = "bg-red-400";
		topLeftIcon = (
			<div className="absolute h-8 w-8 -left-4 -top-4">
				{XCircle("text-red-500 bg-gray-400 rounded-full dark:text-red-400")}
			</div>
		);
	} else if (isReuse) {
		topLeftIcon = (
			<Tooltip
				trigger={Exclamation("text-yellow-400 bg-gray-400 rounded-full")}
				position="-top-6 left-6"
				mode="click"
			>
				<div className="bg-gray-600 py-2 px-3 text-2xl font-semibold text-white rounded-lg">
					{nls.get("got-question-wrong-before")}
				</div>
			</Tooltip>
		);
	}

	const inputClassName = `flex-1 w-20 h-10 rounded-md shadow-lg ml-5 text-4xl text-center font-semibold p-2 focus:bg-yellow-100 focus:outline-none p-0 ${inputBoxBgColor}`;

	return (
		<div className="relative p-4 pr-6 rounded-md shadow-lg bg-gray-400 flex justify-items-center w-fit">
			{topLeftIcon}
			<span className="flex-1 w-55 m-auto text-4xl whitespace-nowrap font-semibold">
				{questionContent} =
			</span>
			{disabled ? (
				<div className={inputClassName}>{question.inputElement.value}</div>
			) : (
				<input
					ref={input => (question.inputElement = input)}
					className={inputClassName}
					type="number"
					disabled={disabled}
					onKeyDown={e => {
						if (e.key !== "Enter") return;

						if (!keyDownStartTime) {
							setKeyDownStartTime(performance.now());
						}
					}}
					onKeyUp={e => {
						if (e.key !== "Enter") return;

						const pressedMilli = performance.now() - keyDownStartTime;
						if (pressedMilli > clearInputPressedMilliThreshold) {
							question.inputElement.value = "";
						} else if (
							question.next?.inputElement instanceof HTMLInputElement
						) {
							question.next.inputElement.scrollIntoView({
								block: "center",
								inline: "nearest"
							});
							question.next.inputElement.focus();
						}
						setKeyDownStartTime(undefined);
					}}
				/>
			)}
		</div>
	);
};

QuestionCard.defaultProps = {
	disabled: false
};

export default QuestionCard;
