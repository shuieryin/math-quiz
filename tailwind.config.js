module.exports = {
	content: ["./storybook/**/*.{html,js,ts,tsx}"],
	theme: {
		screens: {
			xxs: "200px",
			// => @media (min-width: 200px) { ... }
			xs: "430px",
			// => @media (min-width: 430px) { ... }
			sm: "576px",
			// => @media (min-width: 576px) { ... }
			md: "810px",
			// => @media (min-width: 960px) { ... }
			lg: "1440px"
			// => @media (min-width: 1440px) { ... }
		},
		extend: {}
	},
	plugins: [],
	variants: {}
};
