import React, { FC, useState } from "react";
import { clearInputPressedMilliThreshold, Question } from "../lib/types";
import { CheckCircle, Exclamation, XCircle } from "./Icons";
import Tooltip from "./Tooltip";
import nls from "../nls";
import Numpad from "./Numpad";

type Props = {
	question: Question;
	disabled?: boolean;
};

const allowedKeys = {
	Tab: true,
	Backspace: true,
	Delete: true,
	Home: true,
	End: true,
	ArrowLeft: true,
	ArrowRight: true,
	Shift: true
};

const QuestionCard: FC<Props> = ({ question, disabled }) => {
	const [isShowNumpad, setIsShowNumpad] = useState<boolean>(false);
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
				triggerPosition="-left-4 -top-4"
				position="-top-6 left-6"
				bodyCss="w-64"
				mode="click"
			>
				<div className="bg-gray-600 py-2 px-3 text-2xl font-semibold text-white rounded-lg">
					{nls.get("got-question-wrong-before")}
				</div>
			</Tooltip>
		);
	}

	const gotoNextQuestion = (question: Question) => {
		if (!question.next) {
			question.inputElement.blur();
			setIsShowNumpad(false);
			return;
		}

		question.next.inputElement.scrollIntoView({
			block: "center",
			inline: "nearest"
		});
		question.next.inputElement.focus();
	};

	const inputClassName = `flex-1 w-20 h-10 rounded-md shadow-lg ml-5 text-4xl text-center font-semibold p-2 focus:bg-yellow-100 focus:outline-none p-0 ${inputBoxBgColor}`;

	return (
		<div className="relative p-4 pr-6 rounded-md shadow-lg bg-gray-400 w-fit">
			{topLeftIcon}
			<label
				className="justify-items-center flex"
				onFocus={() => setIsShowNumpad(true)}
				onBlur={e => setIsShowNumpad(e.currentTarget.contains(e.relatedTarget))}
			>
				<span className="flex-1 w-55 m-auto text-4xl whitespace-nowrap font-semibold">
					{questionContent} =
				</span>
				{disabled ? (
					<div className={inputClassName}>{question.inputElement.value}</div>
				) : (
					<>
						<input
							ref={input => (question.inputElement = input)}
							className={inputClassName}
							inputMode="none"
							disabled={disabled}
							onKeyDown={e => {
								if (e.key === "Enter") {
									if (!keyDownStartTime) {
										setKeyDownStartTime(performance.now());
									}
								} else {
									if (!allowedKeys[e.key] && !e.key.match(/\d+/)) {
										e.preventDefault();
									}
								}
							}}
							onKeyUp={e => {
								if (e.key !== "Enter") return;

								const pressedMilli = performance.now() - keyDownStartTime;
								if (pressedMilli > clearInputPressedMilliThreshold) {
									question.inputElement.value = "";
								} else {
									gotoNextQuestion(question);
								}
								setKeyDownStartTime(undefined);
							}}
						/>
						{isShowNumpad && (
							<div
								className={`absolute z-10 left-0 ${
									question?.next?.next ? "top-20" : "-top-56"
								}`}
							>
								<Numpad
									onClick={value => {
										switch (value) {
											case "Enter":
												setTimeout(() => gotoNextQuestion(question), 0);
												break;
											case "Backspace":
												question.inputElement.value =
													question.inputElement.value.slice(0, -1);
												question.inputElement.focus();
												break;
											default:
												question.inputElement.value += value;
												question.inputElement.focus();
										}
									}}
								/>
							</div>
						)}
					</>
				)}
			</label>
		</div>
	);
};

QuestionCard.defaultProps = {
	disabled: false
};

export default QuestionCard;
