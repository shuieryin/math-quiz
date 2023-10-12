import React, { FunctionComponent, useRef, useState } from "react";
import { Question } from "../lib/types";
import { questionCardTopLeft, unmarshalQuestionContent } from "../lib/utils";
import InputWithNumpad from "./InputWithNumpad";
import useNextQuestion from "../hooks/useNextQuestion";

type Props = {
	question: Question<string, number>;
	disabled?: boolean;
};

const QuestionCard: FunctionComponent<Props> = ({ question, disabled }) => {
	const inputRef = useRef<HTMLInputElement>();
	const [isShowNumpad, setIsShowNumpad] = useState<boolean>(false);
	const { inputBoxBgColor, topLeftIcon } = questionCardTopLeft(question);

	const handleChange = (value: string) => {
		if (!isNaN(value as unknown as number)) {
			question.inputAnswer = Number(value);
		} else {
			delete question.inputAnswer;
		}
	};

	const gotoNextQuestion = useNextQuestion(question, inputRef, () =>
		setIsShowNumpad(false)
	);

	const inputClassName = `flex-1 answer-box-width h-10 rounded-md shadow-lg ml-5 text-4xl text-center font-semibold focus:bg-yellow-100 focus:outline-none p-0 ${inputBoxBgColor}`;

	return (
		<div className="relative p-4 pr-6 rounded-md shadow-lg bg-gray-400 w-fit">
			{topLeftIcon}
			<label
				className="justify-items-center flex"
				onFocus={() => setIsShowNumpad(true)}
				onBlur={e => setIsShowNumpad(e.currentTarget.contains(e.relatedTarget))}
			>
				<span className="flex-1 w-55 m-auto text-4xl whitespace-nowrap font-semibold">
					{unmarshalQuestionContent(question.questionContent)} =
				</span>
				{disabled ? (
					<div className={inputClassName}>{question.inputAnswer}</div>
				) : (
					<InputWithNumpad
						inputRef={inputRef}
						className={inputClassName}
						disabled={disabled}
						handleChange={handleChange}
						isShowNumpad={isShowNumpad}
						onEnter={() => setTimeout(gotoNextQuestion)}
						numpadClassName="top-16"
					/>
				)}
			</label>
		</div>
	);
};

QuestionCard.defaultProps = {
	disabled: false
};

export default QuestionCard;
