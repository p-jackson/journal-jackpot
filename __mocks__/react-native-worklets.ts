// Mock for react-native-worklets
export const scheduleOnRN = jest.fn((fn: () => void) => { fn(); });
