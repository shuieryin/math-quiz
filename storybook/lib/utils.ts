export const defaultDocParams = () => ({
	viewMode: "docs",
	previewTabs: {
		canvas: {
			hidden: true
		}
	}
});

export const randInt = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const firstEntry = (obj = {}) => {
	// noinspection LoopStatementThatDoesntLoopJS
	for (const key in obj) {
		return [key, obj[key]];
	}
};

export const randBool = () => Math.random() >= 0.5;
