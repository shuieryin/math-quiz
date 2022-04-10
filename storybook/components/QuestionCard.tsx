import React, { FC, useState } from "react";
import { clearInputPressedMilliThreshold, Question } from "../lib/types";

type Props = {
	question: Question;
	disabled?: boolean;
};

const QuestionCard: FC<Props> = ({ question, disabled }) => {
	const { correct, questionContent } = question;
	const [keyDownStartTime, setKeyDownStartTime] = useState<number>();

	let inputBoxBgColor;
	if (correct === true) {
		inputBoxBgColor = "bg-green-700";
	} else if (correct === false) {
		inputBoxBgColor = "bg-red-400";
	}

	return (
		<div className="p-4 pr-6 rounded-md shadow-lg bg-gray-400 flex justify-items-center w-fit">
			<span className="flex-1 w-55 m-auto text-4xl whitespace-nowrap font-semibold">
				{questionContent} =
			</span>
			<input
				ref={input => (question.inputElement = input)}
				className={`flex-1 w-20 h-10 rounded-md shadow-lg ml-5 text-4xl text-center font-semibold p-2 focus:bg-yellow-100 focus:outline-none p-0 ${inputBoxBgColor}`}
				type="number"
				disabled={disabled}
				onKeyDown={e => {
					if (
						e.key !== "Enter" ||
						!(question.next?.inputElement instanceof HTMLInputElement)
					) {
						return;
					}

					if (!keyDownStartTime) {
						setKeyDownStartTime(performance.now());
					}
				}}
				onKeyUp={e => {
					if (
						e.key !== "Enter" ||
						!(question.next?.inputElement instanceof HTMLInputElement)
					) {
						return;
					}
					const pressedMilli = performance.now() - keyDownStartTime;
					if (pressedMilli > clearInputPressedMilliThreshold) {
						question.inputElement.value = "";
					} else {
						question.next.inputElement.scrollIntoView({
							block: "center",
							inline: "nearest"
						});
						question.next.inputElement.focus();
					}
					setKeyDownStartTime(undefined);
				}}
			/>
		</div>
	);
};

QuestionCard.defaultProps = {
	disabled: false
};

export default QuestionCard;
