const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: "zmcx3x",
  fixturesFolder: false,
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'https://odata.ikentoo.com/odata/v2',
    supportFile: false,
  },
})
