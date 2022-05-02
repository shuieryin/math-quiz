import React, { FC, useState, useEffect, useRef } from "react";
import { DisplayType } from "../lib/types";

type Props = {
	open?: boolean;
	isTriggerFixed?: boolean;
	triggerPosition?: string;
	position?: string;
	trigger: DisplayType;
	children: DisplayType;
	mode?: "hover" | "click";
	bodyCss?: string;
};

const Tooltip: FC<Props> = ({
	open,
	isTriggerFixed,
	triggerPosition,
	position,
	trigger,
	children,
	mode,
	bodyCss
}) => {
	const buttonRef = useRef<HTMLButtonElement>();
	const containerRef = useRef<HTMLDivElement>();
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
					buttonRef.current instanceof HTMLButtonElement &&
					containerRef.current instanceof HTMLDivElement &&
					e?.target !== buttonRef.current &&
					e?.target !== containerRef.current &&
					!buttonRef.current.contains(e?.target as HTMLButtonElement) &&
					!containerRef.current.contains(e?.target as HTMLDivElement)
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
				className={`h-8 w-8${
					isTriggerFixed ? " absolute" : ""
				} ${triggerPosition}`}
				{...triggerEvents}
			>
				{trigger}
			</button>
			<div
				ref={containerRef}
				className={`inline-block absolute z-10 shadow-lg transition-opacity duration-300 ${position} ${
					isOpen ? "visible opacity-100" : "invisible opacity-0"
				} ${bodyCss}`}
			>
				{children}
			</div>
		</>
	);
};

Tooltip.defaultProps = {
	open: false,
	isTriggerFixed: true,
	mode: "hover"
};

export default Tooltip;
