const { defineConfig } = require('cypress');
const coverage = require('@cypress/code-coverage/task');

module.exports = defineConfig({
  component: {
    reporter: 'mochawesome',
    reporterOptions: {
      overwrite: true,
      html: false,
      json: true,
      reportDir: './report/tests',
      reportFilename: '[name]-report',
    },
    setupNodeEvents(on, config) {
      coverage(on, config);
      return config;
    },
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    // retries: 3,
    video: true,
  },
});
