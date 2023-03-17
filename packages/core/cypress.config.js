const { defineConfig } = require("cypress");
const  coverage = require('@cypress/code-coverage/task');

module.exports = defineConfig({
  component: {
    setupNodeEvents(on, config) {
      coverage(on, config);
      return config;
    },
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    video: false
  },
});
