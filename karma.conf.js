module.exports = function (config) {
  let reporters = ["progress", "kjhtml"];
  if (config.codeCoverage) {
    reporters.push("coverage-istanbul");
  }
  config.set({
    frameworks: ["jasmine", "karma-typescript"],
    plugins: [
      require("karma-typescript"),
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage-istanbul-instrumenter"),
      require("karma-coverage-istanbul-reporter"),
    ],
    files: [
      { pattern: "src/**/*.ts" },
      { pattern: "specs/**/*.ts" },
      { pattern: "mocks/**/*.ts" },
    ],
    preprocessors: {
      "src/**/*.ts": [
        "karma-typescript",
        "karma-coverage-istanbul-instrumenter",
      ],
      "specs/**/*.ts": ["karma-typescript"],
      "mocks/**/*.ts": ["karma-typescript"],
      "mocks/**/!(*.mocks).ts": [
        "karma-typescript",
        "karma-coverage-istanbul-instrumenter",
      ],
    },
    client: {
      jasmine: {
        random: false,
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    karmaTypescriptConfig: {
      bundlerOptions: {
        addNodeGlobals: false,
      },
      coverageOptions: {
        instrumentation: false,
      },
    },
    coverageIstanbulInstrumenter: {
      esModules: true,
    },
    coverageIstanbulReporter: {
      dir: require("path").join(__dirname, "/coverage/cable-x-js"),
      reports: ["html", "lcovonly", "text-summary"],
      fixWebpackSourcePaths: true,
    },
    reporters: reporters,
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ["Chrome"],
    singleRun: true,
    restartOnFileChange: false,
  });
};
