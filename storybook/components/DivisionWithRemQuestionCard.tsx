import React, {
	FocusEventHandler,
	FunctionComponent,
	useRef,
	useState
} from "react";
import { DivisionRemAnswer, DivisionRemQuestion, Question } from "../lib/types";
import { questionCardTopLeft } from "../lib/utils";
import InputWithNumpad from "./InputWithNumpad";
import useNextQuestion from "../hooks/useNextQuestion";

type Props = {
	question: Question<DivisionRemQuestion, DivisionRemAnswer>;
	disabled?: boolean;
};

const DivisionWithRemQuestionCard: FunctionComponent<Props> = ({
	question,
	disabled
}) => {
	const inputQuotientRef = useRef<HTMLInputElement>();
	const inputRemainderRef = useRef<HTMLInputElement>();
	const [isShowQuotientNumpad, setIsShowQuotientNumpad] =
		useState<boolean>(false);
	const [isShowRemainderNumpad, setIsShowRemainderNumpad] =
		useState<boolean>(false);
	const { correctColor, incorrectColor, topLeftIcon } =
		questionCardTopLeft(question);

	const handleChange = (propName: "quotient" | "remainder", value: string) => {
		if (!(question.inputAnswer instanceof Object)) {
			question.inputAnswer = {};
		}

		if (!isNaN(value as unknown as number)) {
			question.inputAnswer[propName] = Number(value);
		} else {
			delete question.inputAnswer[propName];
		}
	};

	const gotoRemainder = () => {
		inputRemainderRef.current.scrollIntoView({
			block: "center",
			inline: "nearest"
		});
		inputRemainderRef.current.focus();
	};

	const gotoNextQuestion = useNextQuestion(question, inputQuotientRef, () => {
		setIsShowQuotientNumpad(false);
		setIsShowRemainderNumpad(false);
	});

	const showHideQuotientNumpadFuncs: {
		onFocus: FocusEventHandler<HTMLDivElement>;
		onBlur: FocusEventHandler<HTMLDivElement>;
	} = {
		onFocus: () => setIsShowQuotientNumpad(true),
		onBlur: e =>
			setIsShowQuotientNumpad(e.currentTarget.contains(e.relatedTarget))
	};

	const showHideRemainderNumpadFuncs: {
		onFocus: FocusEventHandler<HTMLDivElement>;
		onBlur: FocusEventHandler<HTMLDivElement>;
	} = {
		onFocus: () => setIsShowRemainderNumpad(true),
		onBlur: e =>
			setIsShowRemainderNumpad(e.currentTarget.contains(e.relatedTarget))
	};

	const inputClassName =
		"flex-1 answer-box-width h-10 rounded-md shadow-lg text-4xl text-center font-semibold focus:bg-yellow-100 focus:outline-none p-0";
	const questionPartClassName =
		"w-55 m-auto text-4xl whitespace-nowrap font-semibold";

	const { dividend, divisor } = question.questionContent;
	const { quotient: inputQuotient, remainder: inputRemainder } =
		question.inputAnswer || {};
	const { quotient, remainder } = question.answer;
	return (
		<div className="relative p-4 pr-6 rounded-md shadow-lg bg-gray-400 w-fit">
			{topLeftIcon}
			<div
				style={{
					gridTemplateColumns: "auto auto auto auto auto",
					display: "grid",
					rowGap: 10
				}}
			>
				<div className={questionPartClassName} {...showHideQuotientNumpadFuncs}>
					{dividend}
				</div>
				<div className={questionPartClassName} {...showHideQuotientNumpadFuncs}>
					÷
				</div>
				<div className={questionPartClassName} {...showHideQuotientNumpadFuncs}>
					{divisor}
				</div>
				<div
					className={`${questionPartClassName} pl-4 pr-4`}
					{...showHideQuotientNumpadFuncs}
				>
					=
				</div>
				<div {...showHideQuotientNumpadFuncs}>
					{disabled ? (
						<div
							className={`${inputClassName} ${
								inputQuotient === quotient ? correctColor : incorrectColor
							}`}
						>
							{inputQuotient}
						</div>
					) : (
						<InputWithNumpad
							inputRef={inputQuotientRef}
							className={inputClassName}
							disabled={disabled}
							handleChange={value => handleChange("quotient", value)}
							isShowNumpad={isShowQuotientNumpad}
							onEnter={() => setTimeout(gotoRemainder)}
							numpadClassName="top-16"
						/>
					)}
				</div>
				<div {...showHideRemainderNumpadFuncs} />
				<div
					className={questionPartClassName}
					{...showHideRemainderNumpadFuncs}
				>
					%
				</div>
				<div {...showHideRemainderNumpadFuncs} />
				<div
					className={`${questionPartClassName} pl-4 pr-4`}
					{...showHideRemainderNumpadFuncs}
				>
					=
				</div>
				<div {...showHideRemainderNumpadFuncs}>
					{disabled ? (
						<div
							className={`${inputClassName} ${
								inputRemainder === remainder ? correctColor : incorrectColor
							}`}
						>
							{inputRemainder}
						</div>
					) : (
						<InputWithNumpad
							inputRef={inputRemainderRef}
							className={inputClassName}
							disabled={disabled}
							handleChange={value => handleChange("remainder", value)}
							isShowNumpad={isShowRemainderNumpad}
							onEnter={() => setTimeout(gotoNextQuestion)}
							numpadClassName="top-28"
						/>
					)}
				</div>
			</div>
		</div>
	);
};

DivisionWithRemQuestionCard.defaultProps = {
	disabled: false
};

export default DivisionWithRemQuestionCard;
