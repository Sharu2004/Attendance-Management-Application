import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Silence any console warnings/errors during unit test execution if needed
beforeEach(async () => {
  await mockAsyncStorage.clear();
  jest.clearAllMocks();
});
