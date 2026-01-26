// Extend Jest with React Native Testing Library matchers
import "@testing-library/react-native/build/matchers/extend-expect";

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  })),
  usePathname: jest.fn(() => "/"),
  Link: ({ children }: { children: React.ReactNode }) => children,
  Slot: () => null,
}));

// Mock expo-font
jest.mock("expo-font", () => ({
  useFonts: () => [true, null],
  isLoaded: () => true,
}));

// Mock expo-splash-screen
jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn().mockResolvedValue(false),
  hideAsync: jest.fn().mockResolvedValue(undefined),
}));

// Mock expo-linear-gradient
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: "LinearGradient",
}));

// react-native-reanimated is auto-mocked via __mocks__/react-native-reanimated.js
// react-native-reanimated/mock is mapped via moduleNameMapper in jest.config.js
// (needed because expo-router/testing-library overrides the reanimated mock)
