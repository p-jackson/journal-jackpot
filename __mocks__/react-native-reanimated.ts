// Auto-mock for react-native-reanimated.
// Implementation in separate file to avoid circular dependency when
// expo-router/testing-library requires react-native-reanimated/mock.
export * from "./react-native-reanimated-impl";
export { default } from "./react-native-reanimated-impl";
