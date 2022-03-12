import "!style-loader!css-loader!less-loader!./assets/global.less";
import { create, themes } from "@storybook/theming";
import { ThemeVars } from "@storybook/theming/dist/ts3.9/types";
import { render } from "solid-js/web";

const themeConfig: ThemeVars = {
	base: "dark",
	brandTitle: "数学练习"
};

const darkTheme = create(themeConfig);

const lightTheme = create({
	...themeConfig,
	base: "light"
});

export const parameters = {
	darkMode: {
		current: "dark",
		dark: darkTheme,
		light: lightTheme
	},
	docs: {
		theme: themes.dark
	},
	controls: { hideNoControlsWarning: true }
};

let disposeStory;

export const decorators = [
	Story => {
		if (disposeStory) {
			disposeStory();
		}
		const root = document.getElementById("root");
		const solid = document.createElement("div");

		solid.setAttribute("id", "solid-root");
		root.appendChild(solid);
		disposeStory = render(Story, solid);
		return solid;
		// return createRoot(() => Story()); // do not work correctly https://github.com/solidjs/solid/issues/553
	}
];
