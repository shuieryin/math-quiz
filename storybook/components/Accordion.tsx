import React, { FC, useState } from "react";
import { DisplayType } from "../lib/types";
import { ArrowDown, ArrowUp } from "./Icons";

type Props = {
	first?: boolean;
	last?: boolean;
	header?: DisplayType;
	content?: DisplayType;
	open?: boolean;
};

const Accordion: FC<Props> = ({
	first,
	last,
	header,
	content,
	open: openProp
}) => {
	const [open, setOpen] = useState<boolean>(openProp);
	return (
		<>
			{header && (
				<h2>
					<button
						type="button"
						className={`flex justify-between items-center p-5 w-full font-medium text-left text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 hover:bg-gray-100${
							first ? " rounded-t-lg" : ""
						}${!open && last ? " rounded-b-lg" : ""}${
							open ? " border-b-0" : ""
						}`}
						aria-expanded={open}
						onClick={() => setOpen(!open)}
					>
						<span className="text-3xl">{header}</span>
						{open ? ArrowUp() : ArrowDown()}
					</button>
				</h2>
			)}
			{content && (
				<div className={`${open ? "" : "hidden"}`}>
					<div
						className={`p-5 border border-gray-200${
							!header && first ? " rounded-t-lg" : ""
						}${last ? " rounded-b-lg" : ""}${!last ? " border-b-0" : ""}`}
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
	last: false
};

export default Accordion;
