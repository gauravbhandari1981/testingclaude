const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:8765' },
  webServer: {
    command: 'python3 -m http.server 8765',
    url: 'http://localhost:8765',
    reuseExistingServer: !process.env.CI,
  },
});
