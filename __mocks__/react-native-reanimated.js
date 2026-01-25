// Auto-mock for react-native-reanimated.
// Implementation in separate file to avoid circular dependency when
// expo-router/testing-library requires react-native-reanimated/mock.
module.exports = require('./react-native-reanimated-impl');
