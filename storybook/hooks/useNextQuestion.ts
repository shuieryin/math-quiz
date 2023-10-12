import { MutableRefObject, useEffect } from "react";
import { Question } from "../lib/types";

export default <QuestionType, AnswerType>(
	question: Question<QuestionType, AnswerType>,
	inputRef: MutableRefObject<HTMLInputElement>,
	onGotoNext = () => {}
) => {
	const gotoNextQuestion = () => {
		if (!question.next) {
			inputRef.current.blur();
			onGotoNext();
			return;
		}

		question.next.focusInput();
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

	return gotoNextQuestion;
};
