module.exports = {
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },

  moduleNameMapper: {
    '\\.(css|less|scss|sass|tailwind)$': 'identity-obj-proxy',
  },

  setupFilesAfterEnv: ['<rootDir>/tests/setupTests'],
};
