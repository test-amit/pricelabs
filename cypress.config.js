const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    defaultCommandTimeout: 15000,  // Increase default timeout (15 seconds)
    pageLoadTimeout: 60000,        // Increase page load timeout (60 seconds)
    requestTimeout: 20000,         // Increase request timeout (20 seconds)
    responseTimeout: 20000,        // Increase response timeout (20 seconds)

    baseUrl: 'https://app.pricelabs.co', // Base URL
    supportFile: 'cypress/support/e2e.js',
    env: {
      username: 'qa.pricelabs@gmail.com',
      password: 'qg33N$yxJP',
    },
  },
});


