import Numpad, { NumpadOnClick } from "./Numpad";
import React, {
	FunctionComponent,
	KeyboardEventHandler,
	MutableRefObject,
	useRef,
	useState
} from "react";
import { clearInputPressedMilliThreshold } from "../lib/types";

type Props = {
	className?: string;
	disabled?: boolean;
	handleChange?: (value: string) => void;
	isShowNumpad?: boolean;
	onEnter?: VoidFunction;
	inputRef?: MutableRefObject<HTMLInputElement>;
	numpadClassName?: string;
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

const InputWithNumpad: FunctionComponent<Props> = ({
	className,
	disabled,
	handleChange,
	isShowNumpad,
	onEnter,
	inputRef = useRef<HTMLInputElement>(),
	numpadClassName
}) => {
	const [keyDownStartTime, setKeyDownStartTime] = useState<number>();

	const numpadOnClick: NumpadOnClick = value => {
		switch (value) {
			case "Enter":
				onEnter();
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
			onEnter();
		}
		setKeyDownStartTime(undefined);
	};

	return (
		<div>
			<input
				ref={inputRef}
				className={className}
				inputMode="none"
				disabled={disabled}
				onChange={e => handleChange(e.target.value)}
				onKeyDown={inputOnKeyDown}
				onKeyUp={inputOnKeyUp}
			/>
			{isShowNumpad && (
				<div className={`absolute z-10 left-0 ${numpadClassName}`}>
					<Numpad onClick={numpadOnClick} />
				</div>
			)}
		</div>
	);
};

export default InputWithNumpad;
