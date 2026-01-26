const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Exclude test files from bundling
config.resolver.blockList = [
  /.*__mocks__\/.*/,
  /.*__tests__\/.*/,
  /jest\.setup\..*/,
  /.*test-utils\.(ts|tsx)$/,
];

module.exports = withNativeWind(config);
