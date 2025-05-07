import { defineConfig } from "cypress";

export default {
  projectId: 'rc512x',
  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },

  e2e: {
    baseUrl: 'http://localhost:4200',
    env: {
      'api-url': 'http://localhost:3000',
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message) {
          // eslint-disable-next-line no-console
          console.log(message);
          return null;
        }
      });
    },
  },
};
