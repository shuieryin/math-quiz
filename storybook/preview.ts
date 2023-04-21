import "!style-loader!css-loader!postcss-loader!tailwindcss/tailwind.css";
import "!style-loader!css-loader!less-loader!./assets/global.less";
import { create, themes, ThemeVars } from "@storybook/theming";
import nls from "./nls";

const themeConfig: ThemeVars = {
	base: "dark",
	brandTitle: nls.get("math-quiz")
};

const darkTheme = create(themeConfig);

const lightTheme = create({
	...themeConfig,
	base: "light"
});

const digitOrder = [nls.get("two-digits"), nls.get("three-digits")];
const equationOrder = [
	nls.get("addition"),
	digitOrder,
	nls.get("subtraction"),
	digitOrder,
	nls.get("addition-and-subtraction"),
	digitOrder,
	nls.get("multiplication"),
	digitOrder,
	nls.get("division"),
	digitOrder
];

export const parameters = {
	darkMode: {
		current: "dark",
		dark: darkTheme,
		light: lightTheme
	},
	docs: {
		theme: themes.dark
	},
	controls: { hideNoControlsWarning: true },
	options: {
		storySort: {
			order: [
				nls.get("grade-one"),
				[
					nls.get("within-20"),
					equationOrder,
					nls.get("within-100"),
					equationOrder,
					nls.get("within-1k"),
					equationOrder,
					nls.get("within-10k"),
					equationOrder
				],
				nls.get("grade-two"),
				[
					nls.get("within-10"),
					equationOrder,
					nls.get("within-100"),
					equationOrder,
					nls.get("within-1k"),
					equationOrder,
					nls.get("within-10k"),
					equationOrder
				]
			]
		}
	}
};
