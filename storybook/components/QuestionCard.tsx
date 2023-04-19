import React, {
	FunctionComponent,
	KeyboardEventHandler,
	useEffect,
	useRef,
	useState
} from "react";
import { clearInputPressedMilliThreshold, Question } from "../lib/types";
import { CheckCircle, Exclamation, XCircle } from "./Icons";
import Tooltip from "./Tooltip";
import nls from "../nls";
import Numpad, { NumpadOnClick } from "./Numpad";

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

const QuestionCard: FunctionComponent<Props> = ({ question, disabled }) => {
	const inputRef = useRef<HTMLInputElement>();
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
				mode="click"
			>
				<div className="bg-gray-600 py-2 px-3 text-2xl font-semibold text-white rounded-lg">
					{nls.get("got-question-wrong-in-the-past")}
				</div>
			</Tooltip>
		);
	}

	const gotoNextQuestion = () => {
		if (!question.next) {
			inputRef.current.blur();
			setIsShowNumpad(false);
			return;
		}

		question.next.focusInput();
	};

	const handleChange = (value: string) => {
		if (!isNaN(value as unknown as number)) {
			question.inputAnswer = Number(value);
		} else {
			delete question.inputAnswer;
		}
	};

	const numpadOnClick: NumpadOnClick = value => {
		switch (value) {
			case "Enter":
				gotoNextQuestion();
				break;
			case "Backspace":
				inputRef.current.value = inputRef.current.value.slice(0, -1);
				inputRef.current.focus();
				handleChange(inputRef.current.value);
				break;
			default:
				inputRef.current.value += value;
				inputRef.current.focus();
				handleChange(inputRef.current.value);
		}
	};

	const inputOnKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
		if (e.key === "Enter") {
			if (!keyDownStartTime) {
				setKeyDownStartTime(performance.now());
			}
		} else {
			if (!allowedKeys[e.key] && !e.key.match(/\d+/)) {
				e.preventDefault();
			}
		}
	};

	const inputOnKeyUp: KeyboardEventHandler<HTMLInputElement> = e => {
		if (e.key !== "Enter") return;

		const pressedMilli = performance.now() - keyDownStartTime;
		if (pressedMilli > clearInputPressedMilliThreshold) {
			inputRef.current.value = "";
		} else {
			gotoNextQuestion();
		}
		setKeyDownStartTime(undefined);
	};

	useEffect(() => {
		question.focusInput = () => {
			inputRef.current.scrollIntoView({
				block: "center",
				inline: "nearest"
			});
			inputRef.current.focus();
		};
	}, [question]);

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
					{questionContent} =
				</span>
				{disabled ? (
					<div className={inputClassName}>{question.displayInputAnswer()}</div>
				) : (
					<>
						<input
							ref={inputRef}
							className={inputClassName}
							inputMode="none"
							disabled={disabled}
							onChange={e => handleChange(e.target.value)}
							onKeyDown={inputOnKeyDown}
							onKeyUp={inputOnKeyUp}
						/>
						{isShowNumpad && (
							<div
								className={`absolute z-10 left-0 ${
									question?.next?.next ? "top-20" : "-top-56"
								}`}
							>
								<Numpad onClick={numpadOnClick} />
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
