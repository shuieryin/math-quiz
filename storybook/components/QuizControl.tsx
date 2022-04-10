import React, { FC, useState } from "react";
import QuestionGenerator from "../lib/QuestionGenerator";

export type OnStart = (questionSize: number) => void | Promise<void>;

type Props = {
	questionGenerator: QuestionGenerator;
	onStart: OnStart;
};

const QuizControl: FC<Props> = ({ questionGenerator, onStart }) => {
	const questionSizes = questionGenerator.questionSizes();
	const [questionSize, setQuestionSize] = useState(questionSizes[1]);

	return (
		<div className="flex flex-row flex-nowrap gap-x-5 items-center !text-3xl">
			<select
				className="rounded-md shadow-lg form-select form-select-sm px-2 py-1 !text-3xl font-normal text-gray-700 bg-clip-padding bg-no-repeat border border-solid transition ease-in-out m-0 bg-gray-400 hover:bg-gray-500 border-none text-gray-900"
				value={questionSize}
				onChange={e => setQuestionSize(Number(e.target.value))}
			>
				{questionSizes.map(size => (
					<option key={`question-size-${size}`} value={size}>
						{size} 题
					</option>
				))}
			</select>
			<button
				className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 font-bold !text-3xl"
				onClick={async () => await onStart(questionSize)}
			>
				重新开始
			</button>
		</div>
	);
};

QuizControl.defaultProps = {
	onStart: () => {}
};

export default QuizControl;
