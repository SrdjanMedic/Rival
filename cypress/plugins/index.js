// cypress/plugins/index.js

module.exports = (on, config) => {
    on("task", {
      executeLoginTest({ username, password, businessId }) {
        const cypress = require("cypress");
        const options = {
          spec: "cypress/e2e/authentication.cy.js",
          env: {
            username,
            password,
            businessId,
          },
        };
  
        return cypress
          .run(options)
          .then((results) => {
            if (results.totalFailed) {
              throw new Error("Login test execution failed");
            }
            return null;
          })
          .catch((error) => {
            throw new Error(`Failed to execute login test: ${error.message}`);
          });
      },
    });
  };
  