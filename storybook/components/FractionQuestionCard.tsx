import { Fraction, Question } from "../lib/types";
import React, {
	FocusEventHandler,
	FunctionComponent,
	useRef,
	useState
} from "react";
import { questionCardTopLeft } from "../lib/utils";
import InputWithNumpad from "./InputWithNumpad";
import useNextQuestion from "../hooks/useNextQuestion";
import FractionView from "./FractionView";

type Props = {
	question: Question<Fraction[], Fraction>;
	operator: string;
	disabled?: boolean;
};

const FractionQuestionCard: FunctionComponent<Props> = ({
	question,
	operator,
	disabled
}) => {
	const inputNumeratorRef = useRef<HTMLInputElement>();
	const inputDenominatorRef = useRef<HTMLInputElement>();
	const [isShowNumeratorNumpad, setIsShowNumeratorNumpad] =
		useState<boolean>(false);
	const [isShowDenominatorNumpad, setIsShowDenominatorNumpad] =
		useState<boolean>(false);
	const { correctColor, incorrectColor, topLeftIcon } =
		questionCardTopLeft(question);

	const handleChange = (
		propName: "numerator" | "denominator",
		value: string
	) => {
		if (!(question.inputAnswer instanceof Object)) {
			question.inputAnswer = { numerator: 0, denominator: 0 };
		}

		if (!isNaN(value as unknown as number)) {
			question.inputAnswer[propName] = Number(value);
		} else {
			delete question.inputAnswer[propName];
		}
	};

	const gotoDenominator = () => {
		inputDenominatorRef.current.scrollIntoView({
			block: "center",
			inline: "nearest"
		});
		inputDenominatorRef.current.focus();
	};

	const gotoNextQuestion = useNextQuestion(question, inputNumeratorRef, () => {
		setIsShowNumeratorNumpad(false);
		setIsShowDenominatorNumpad(false);
	});

	const showHideNumeratorNumpadFuncs: {
		onFocus: FocusEventHandler<HTMLDivElement>;
		onBlur: FocusEventHandler<HTMLDivElement>;
	} = {
		onFocus: () => setIsShowNumeratorNumpad(true),
		onBlur: e =>
			setIsShowNumeratorNumpad(e.currentTarget.contains(e.relatedTarget))
	};

	const showHideDenominatorNumpadFuncs: {
		onFocus: FocusEventHandler<HTMLDivElement>;
		onBlur: FocusEventHandler<HTMLDivElement>;
	} = {
		onFocus: () => setIsShowDenominatorNumpad(true),
		onBlur: e =>
			setIsShowDenominatorNumpad(e.currentTarget.contains(e.relatedTarget))
	};

	const inputClassName =
		"flex-1 answer-box-width h-10 rounded-md shadow-lg text-4xl text-center font-semibold focus:bg-yellow-100 focus:outline-none p-0";
	const questionPartClassName =
		"w-55 m-auto text-4xl whitespace-nowrap font-semibold text-center";

	const { numerator: inputNumerator, denominator: inputDenominator } =
		question.inputAnswer || { numerator: 0, denominator: 0 };
	const { numerator, denominator } = question.answer;
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
				<FractionView
					fraction={question.questionContent[0]}
					numeratorClassName={questionPartClassName}
					denominatorClassName={questionPartClassName}
					numeratorAttributes={showHideNumeratorNumpadFuncs}
					denominatorAttributes={showHideNumeratorNumpadFuncs}
				/>
				<div
					className={`${questionPartClassName} pl-4 pr-4`}
					{...showHideNumeratorNumpadFuncs}
				>
					{operator}
				</div>
				<FractionView
					fraction={question.questionContent[1]}
					numeratorClassName={questionPartClassName}
					denominatorClassName={questionPartClassName}
					numeratorAttributes={showHideNumeratorNumpadFuncs}
					denominatorAttributes={showHideNumeratorNumpadFuncs}
				/>
				<div
					className={`${questionPartClassName} pl-4 pr-4`}
					{...showHideNumeratorNumpadFuncs}
				>
					=
				</div>
				<div>
					<div {...showHideNumeratorNumpadFuncs}>
						{disabled ? (
							<div
								className={`${inputClassName} ${
									inputNumerator === numerator ? correctColor : incorrectColor
								}`}
							>
								{inputNumerator}
							</div>
						) : (
							<InputWithNumpad
								inputRef={inputNumeratorRef}
								className={inputClassName}
								disabled={disabled}
								handleChange={value => handleChange("numerator", value)}
								isShowNumpad={isShowNumeratorNumpad}
								onEnter={() => setTimeout(gotoDenominator)}
								numpadClassName="top-16"
							/>
						)}
					</div>
					<hr
						style={{
							borderTop: "5px solid",
							width: 100,
							margin: "10px 0"
						}}
					/>
					<div {...showHideDenominatorNumpadFuncs}>
						{disabled ? (
							<div
								className={`${inputClassName} ${
									inputDenominator === denominator
										? correctColor
										: incorrectColor
								}`}
							>
								{inputDenominator}
							</div>
						) : (
							<InputWithNumpad
								inputRef={inputDenominatorRef}
								className={inputClassName}
								disabled={disabled}
								handleChange={value => handleChange("denominator", value)}
								isShowNumpad={isShowDenominatorNumpad}
								onEnter={() => setTimeout(gotoNextQuestion)}
								numpadClassName="top-32"
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default FractionQuestionCard;
