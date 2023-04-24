import React, {
	Dispatch,
	FunctionComponent,
	ReactNode,
	SetStateAction,
	useState
} from "react";
import { createPortal } from "react-dom";
import "./quiz-container.less";

type InitNode = (
	setIsShowModal: Dispatch<SetStateAction<boolean>>
) => ReactNode;

type Props = {
	initTrigger: InitNode;
	initContent: InitNode;
};

const PopupModal: FunctionComponent<Props> = ({ initTrigger, initContent }) => {
	const [isShowModal, setIsShowModal] = useState(false);
	const trigger = initTrigger(setIsShowModal);
	const content = initContent(setIsShowModal);

	return (
		<>
			{trigger}
			{isShowModal
				? createPortal(
						<div className="bg-dim fixed left-0 top-0 right-0 z-50 h-screen justify-center items-center flex">
							<div className="relative w-full max-w-md max-h-full">
								<div className="relative rounded-lg shadow bg-gray-950 border-1">
									{content}
								</div>
							</div>
						</div>,
						document.body
				  )
				: null}
		</>
	);
};

export default PopupModal;
