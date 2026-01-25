import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config: _config }: ConfigContext): ExpoConfig => ({
  name: "journal-jackpot",
  slug: "journal-jackpot",
  scheme: "journal-jackpot",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#09090b",
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier:
      process.env.IOS_BUNDLE_ID ?? "com.anonymous.journal-jackpot",
  },
  plugins: [
    [
      "expo-router",
      {
        root: "./src/app",
      },
    ],
  ],
});
