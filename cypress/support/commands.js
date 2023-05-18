// commands.js

const fs = require("fs");

Cypress.Commands.add("readCredentialsFromFile", () => {
  const filePath = "credentials.txt";
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const credentials = fileContents.split("\n");

  Cypress.env("username", credentials[0]);
  Cypress.env("password", credentials[1]);
});
