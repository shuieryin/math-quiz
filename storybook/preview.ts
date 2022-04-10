import "!style-loader!css-loader!postcss-loader!tailwindcss/tailwind.css";
import "!style-loader!css-loader!less-loader!./assets/global.less";
import { create, themes } from "@storybook/theming";
import { ThemeVars } from "@storybook/theming/dist/ts3.9/types";

const themeConfig: ThemeVars = {
	base: "dark",
	brandTitle: "数学练习"
};

const darkTheme = create(themeConfig);

const lightTheme = create({
	...themeConfig,
	base: "light"
});

const digitOrder = ["二个数字", "三个数字"];
const equationOrder = [
	"加法",
	digitOrder,
	"减法",
	digitOrder,
	"加减法",
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
			order: ["一年级", ["20内", equationOrder, "100内", equationOrder]]
		}
	}
};
