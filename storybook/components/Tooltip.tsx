import React, { FC, useState, useEffect, useRef } from "react";
import { DisplayType } from "../lib/types";

type Props = {
	open?: boolean;
	triggerPosition?: string;
	position?: string;
	trigger: DisplayType;
	children: DisplayType;
	mode?: "hover" | "click";
};

const Tooltip: FC<Props> = ({
	open,
	triggerPosition,
	position,
	trigger,
	children,
	mode
}) => {
	const buttonRef = useRef<HTMLButtonElement>();
	const [isOpen, setIsOpen] = useState<boolean>(open);
	let triggerEvents;

	switch (mode) {
		case "click": {
			triggerEvents = {
				onClick: () => setIsOpen(true)
			};
			break;
		}
		case "hover": {
			triggerEvents = {
				onMouseEnter: () => setIsOpen(true),
				onMouseLeave: () => setIsOpen(false)
			};
			break;
		}
	}

	useEffect(() => {
		// special handling for iPad
		if (mode === "click") {
			const hideTooltip = (e?: MouseEvent) => {
				if (
					buttonRef.current instanceof HTMLElement &&
					e?.target !== buttonRef.current &&
					!buttonRef.current.contains(e?.target as HTMLElement)
				) {
					setIsOpen(false);
				}
			};

			document.addEventListener("click", hideTooltip);
			return () => hideTooltip();
		}
	}, []);

	return (
		<>
			<button
				ref={buttonRef}
				className={`absolute h-8 w-8 ${triggerPosition}`}
				{...triggerEvents}
			>
				{trigger}
			</button>
			<div
				className={`inline-block absolute z-10 shadow-sm transition-opacity duration-300 ${position} ${
					isOpen ? "visible opacity-100" : "invisible opacity-0"
				}`}
			>
				{children}
			</div>
		</>
	);
};

Tooltip.defaultProps = {
	open: false,
	triggerPosition: "-left-4 -top-4",
	position: "-top-4 left-6",
	mode: "hover"
};

export default Tooltip;
