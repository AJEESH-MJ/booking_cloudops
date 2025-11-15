export default {
  testEnvironment: "node",
  verbose: true,
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  globalSetup: "./tests/setup.js",
  globalTeardown: "./tests/teardown.js",
  setupFilesAfterEnv: ["./tests/utils/test-db.js"],
//   extensionsToTreatAsEsm: [".js"],
};
