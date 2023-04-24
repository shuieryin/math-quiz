import React, { FunctionComponent, ReactNode } from "react";
import nls from "../nls";

type Props = {
	bodyContent: ReactNode;
	yesButtonContent?: ReactNode;
	noButtonContent?: ReactNode;
	onYes?: VoidFunction;
	onNo?: VoidFunction;
};

const YesNoModalContent: FunctionComponent<Props> = ({
	bodyContent,
	yesButtonContent = nls.get("yes"),
	noButtonContent = nls.get("no"),
	onYes,
	onNo
}) => {
	return (
		<div className="p-6 text-center">
			<svg
				className="mx-auto mb-4 w-14 h-14 text-gray-200"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
			<h3 className="mb-5 text-lg font-normal text-gray-100">{bodyContent}</h3>
			<div className="flex justify-evenly">
				<button
					type="button"
					className="w-5/12 text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-800 rounded-lg text-2xl font-semibold px-5 py-2.5 mr-2"
					onClick={() => onYes()}
				>
					{yesButtonContent}
				</button>
				<button
					type="button"
					className="w-5/12 text-white focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-2xl font-semibold px-5 py-2.5 hover:text-gray-900 focus:z-10 bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:focus:ring-gray-600"
					onClick={() => onNo()}
				>
					{noButtonContent}
				</button>
			</div>
		</div>
	);
};

export default YesNoModalContent;
