import React, { FunctionComponent, HTMLAttributes } from "react";
import { Fraction } from "../lib/types";

type Props = {
	fraction: Fraction;
	numeratorClassName?: string;
	denominatorClassName?: string;
	numeratorAttributes?: Omit<HTMLAttributes<HTMLDivElement>, "className">;
	denominatorAttributes?: Omit<HTMLAttributes<HTMLDivElement>, "className">;
};

const FractionView: FunctionComponent<Props> = ({
	fraction: { numerator, denominator },
	numeratorClassName,
	denominatorClassName,
	numeratorAttributes,
	denominatorAttributes
}) => {
	return (
		<div>
			<div className={numeratorClassName} {...numeratorAttributes}>
				{numerator}
			</div>
			<hr
				style={{
					borderTop: "5px solid",
					width: 40,
					margin: "10px 0"
				}}
			/>
			<div className={denominatorClassName} {...denominatorAttributes}>
				{denominator}
			</div>
		</div>
	);
};

export default FractionView;
