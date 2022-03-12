import React, { FC, useState, useEffect } from "react";
import "./quiz.less";

type Question = {
	firstInt: number;
	secondInt: number;
	questionContent: string;
	answer: string;
	inputElement?: HTMLInputElement;
	notCorrect?: boolean;
};

type Questions = {
	[question: string]: Question;
};

const fistIntRange = { start: 5, end: 20 };
const secondIntRange = { start: 2 };
const questionSizes = [10, 30, 60, 80, 100, 120, 150];

const firstIntRangeNum = fistIntRange.end - fistIntRange.start - 1;
const maxQuestionSize =
	firstIntRangeNum * (firstIntRangeNum - secondIntRange.start);

const getRandomInt = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const firstEntry = (obj = {}) => {
	// noinspection LoopStatementThatDoesntLoopJS
	for (const key in obj) {
		return [key, obj[key]];
	}
};

const genQuestions = (questionSize: number): Questions => {
	const usedQuestions = new Set();

	const questions = {};
	for (let i = 0; i < Math.min(questionSize, maxQuestionSize); i++) {
		let questionContent, firstInt, secondInt;
		do {
			firstInt = getRandomInt(fistIntRange.start, fistIntRange.end);
			secondInt = getRandomInt(secondIntRange.start, firstInt - 1);
			questionContent = `${firstInt} - ${secondInt}`;
		} while (usedQuestions.has(questionContent));

		usedQuestions.add(questionContent);

		questions[questionContent] = {
			questionContent,
			firstInt,
			secondInt,
			answer: String(firstInt - secondInt)
		} as Question;
	}

	return questions;
};

const Quiz: FC = () => {
	const [questionSize, setQuestionSize] = useState(questionSizes[2]);
	const [questions, setQuestions] = useState<Questions>({});
	const [result, setResult] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [startTime, setStartTime] = useState(0);

	useEffect(() => {
		const question: Question = firstEntry(questions)?.[1];
		if (question) {
			question.inputElement.focus();
		}

		for (const questionContent in questions) {
			const { inputElement } = questions[questionContent];
			inputElement.value = undefined;
		}
	}, [questions]);

	const startQuiz = () => {
		setSubmitted(false);
		setResult(undefined);
		setQuestions(() => genQuestions(questionSize));
		setStartTime(new Date().getTime());

		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleSubmit = () => {
		if (submitted) return;

		const submitTime = new Date().getTime();

		let correctCount = 0;
		for (const questionContent in questions) {
			const question = questions[questionContent];
			const { answer, inputElement } = question;

			const { value: inputAnswer } = inputElement;

			const notCorrect = inputAnswer !== answer;
			if (!notCorrect) {
				correctCount++;
			}
			question.notCorrect = notCorrect;
		}

		const diff = submitTime - startTime;
		const diffMinutes = Math.floor(diff / (60 * 1000));
		const diffSeconds = Math.floor((diff % (60 * 1000)) / 1000);

		setResult(
			`你答对了${correctCount} / ${questionSize}题 ! 用时: ${diffMinutes}分${diffSeconds}秒`
		);
		setSubmitted(true);
	};

	const questionElements = [];
	for (const questionContent in questions) {
		const question = questions[questionContent];
		const { notCorrect } = question;

		let inputBoxColor;
		if (notCorrect) {
			inputBoxColor = "indianred";
		} else if (notCorrect === false) {
			inputBoxColor = "lightgreen";
		}

		questionElements.push(
			<div key={`question-${questionContent}`} className="question">
				{questionContent} =
				<input
					key={`input-${questionContent}`}
					ref={input => (question.inputElement = input)}
					className="question-input"
					style={{
						background: inputBoxColor
					}}
					type="number"
					disabled={submitted}
				/>
			</div>
		);
	}

	return (
		<div className="quiz-container">
			{questionElements.length > 0 && (
				<>
					<div className="question-container">{questionElements}</div>
					<button onClick={handleSubmit} disabled={submitted}>
						提交答案
					</button>
				</>
			)}
			{result && <div>{result}</div>}
			{(questionElements.length === 0 || submitted) && (
				<div className="start-quiz">
					<label>
						题量:{" "}
						<select
							value={questionSize}
							onChange={e => setQuestionSize(Number(e.target.value))}
						>
							{questionSizes
								.filter(size => size <= maxQuestionSize)
								.map(size => (
									<option key={`question-size-${size}`} value={size}>
										{size}
									</option>
								))}
						</select>
					</label>
					<button onClick={startQuiz}>重新开始</button>
				</div>
			)}
		</div>
	);
};

export default Quiz;
