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

export const milliToMinSec = (milli: number) => {
	const minutes = Math.floor(milli / (60 * 1000));
	const seconds = ((milli % (60 * 1000)) / 1000).toFixed(2);

	return { minutes, seconds };
};
