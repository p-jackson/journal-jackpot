const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Exclude test files from bundling
config.resolver.blockList = [
  /.*\.test\.(ts|tsx|js|jsx)$/,
  /.*__mocks__\/.*/,
  /jest\.setup\..*/,
];

module.exports = withNativeWind(config);
