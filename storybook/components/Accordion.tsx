import React, {
	FunctionComponent,
	ReactNode,
	useEffect,
	useState
} from "react";
import { ArrowDown, ArrowUp } from "./Icons";

type Props = {
	first?: boolean;
	last?: boolean;
	header?: ReactNode;
	content?: ReactNode;
	open?: boolean;
	onOpen?: (open: boolean) => void | Promise<void>;
	bgColor?: string;
	disabled?: boolean;
};

const Accordion: FunctionComponent<Props> = ({
	first,
	last,
	header,
	content,
	open: openProp,
	onOpen,
	bgColor,
	disabled
}) => {
	const [open, setOpen] = useState<boolean>(openProp);

	useEffect(() => {
		setOpen(openProp);
	}, [openProp]);

	return (
		<>
			{header && (
				<h2>
					<button
						type="button"
						className={`flex justify-between items-center p-5 w-full font-medium text-left text-gray-400 border border-gray-700 focus:ring-4 focus:ring-gray-800 hover:bg-gray-800${
							first ? " rounded-t-lg" : ""
						}${!open && last ? " rounded-b-lg" : ""}${
							open || !last ? " border-b-0" : ""
						}${open ? " bg-gray-800" : ""}`}
						aria-expanded={open}
						onClick={async () => {
							if (disabled) return;
							const nextOpen = !open;
							onOpen(nextOpen);
							setOpen(nextOpen);
						}}
					>
						<span className="text-3xl text-white font-semibold">{header}</span>
						{!disabled && (open ? ArrowUp() : ArrowDown())}
					</button>
				</h2>
			)}
			{content && (
				<div className={`${open ? "" : "hidden"}`}>
					<div
						className={`relative p-5 border border-gray-700${
							bgColor ? ` ${bgColor}` : ""
						}${!header && first ? " rounded-t-lg" : ""}${
							last ? " rounded-b-lg" : ""
						}${!last ? " border-b-0" : ""}`}
					>
						{content}
					</div>
				</div>
			)}
		</>
	);
};

Accordion.defaultProps = {
	open: false,
	first: false,
	last: false,
	onOpen: () => {},
	disabled: false
};

export default Accordion;
