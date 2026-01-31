module.exports = (api) => {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"],
		plugins: [
			["inline-import", { extensions: [".sql"] }],
			"react-native-worklets/plugin", // Must be last
		],
	};
};
