// Extend Jest with React Native Testing Library matchers
require('@testing-library/react-native/build/matchers/extend-expect');

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() })),
  usePathname: jest.fn(() => '/'),
  Link: ({ children }: { children: React.ReactNode }) => children,
  Slot: () => null,
}));

// Mock expo-font
jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
  isLoaded: () => true,
}));

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

// @expo/vector-icons mocked via __mocks__ directory
