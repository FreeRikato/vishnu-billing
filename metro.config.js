const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable caching for faster builds
config.cache = true;

// Existing extensions
config.resolver.sourceExts.push("sql");
config.resolver.assetExts.push("wasm");

// Optimize resolution
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

// Production optimizations
if (process.env.NODE_ENV === "production") {
	config.transformer.enableBabelRCLookup = false;
	config.transformer.minifyConfig = {
		keep_fnname: undefined,
		keep_classname: undefined,
		mangle: {
			keep_fnname: undefined,
			keep_classname: undefined,
		},
		output: {
			ascii_only: true,
			comments: false,
		},
	};
}

// Existing COOP/COEP headers
config.server.enhanceMiddleware = (middleware) => {
	return (req, res, next) => {
		res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
		res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
		middleware(req, res, next);
	};
};

module.exports = config;
