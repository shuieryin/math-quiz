const { rules, plugins } = require("./webpack.shared");

module.exports = baseConfig => {
	baseConfig.config.module.rules = [
		...baseConfig.config.module.rules,
		...rules
	];

	const [miniCssPlugin] = plugins;
	baseConfig.config.plugins = [...baseConfig.config.plugins, miniCssPlugin];

	return baseConfig.config;
};
