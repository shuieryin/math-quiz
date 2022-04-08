import React, { FC, useEffect, useState } from "react";
import "./quiz-container.less";
import { Question, Questions } from "../lib/types";
import QuestionGenerator from "../lib/QuestionGenerator";

type Props = {
	questionGenerator: QuestionGenerator;
};

const clearInputPressedMilliThreshold = 300;
let keyDownStartTime;
const QuizContainer: FC<Props> = ({ questionGenerator }) => {
	const questionSizes = questionGenerator.questionSizes();
	const [questionSize, setQuestionSize] = useState(questionSizes[2]);
	const [questions, setQuestions] = useState<Questions>([]);
	const [result, setResult] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [startTime, setStartTime] = useState(0);

	useEffect(() => {
		const question: Question = questions[0];
		if (question?.inputElement instanceof HTMLInputElement) {
			question.inputElement.focus();
		}

		for (const { inputElement } of questions) {
			if (inputElement instanceof HTMLInputElement) {
				inputElement.value = "";
			}
		}
	}, [questions]);

	const startQuiz = () => {
		setSubmitted(false);
		setResult(undefined);
		setQuestions(() => questionGenerator.genQuestions(questionSize));
		setStartTime(new Date().getTime());

		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleSubmit = () => {
		if (submitted) return;

		const submitTime = new Date().getTime();

		let correctCount = 0;
		for (const question of questions) {
			const { answer, inputElement } = question;

			const { value: inputAnswer } = inputElement;

			const notCorrect = inputAnswer !== String(answer);
			if (!notCorrect) {
				correctCount++;
			}
			question.notCorrect = notCorrect;
		}

		const diff = submitTime - startTime;
		const diffMinutes = Math.floor(diff / (60 * 1000));
		const diffSeconds = Math.floor((diff % (60 * 1000)) / 1000);

		setResult(
			`你答对了${correctCount} / ${questionSize}题! 用时: ${diffMinutes}分${diffSeconds}秒`
		);
		setSubmitted(true);
	};

	const questionElements = [];
	for (const question of questions) {
		const { notCorrect, questionContent } = question;

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
					onKeyDown={e => {
						if (
							e.key !== "Enter" ||
							!(question.next?.inputElement instanceof HTMLInputElement)
						) {
							return;
						}

						if (!keyDownStartTime) {
							keyDownStartTime = performance.now();
						}
					}}
					onKeyUp={e => {
						if (
							e.key !== "Enter" ||
							!(question.next?.inputElement instanceof HTMLInputElement)
						) {
							return;
						}
						const pressedMilli = performance.now() - keyDownStartTime;
						if (pressedMilli > clearInputPressedMilliThreshold) {
							question.inputElement.value = "";
						} else {
							question.next.inputElement.scrollIntoView({
								behavior: "auto",
								block: "center",
								inline: "center"
							});
							question.next.inputElement.focus();
						}
						keyDownStartTime = undefined;
					}}
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
							{questionSizes.map(size => (
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

export default QuizContainer;
