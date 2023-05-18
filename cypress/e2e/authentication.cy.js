// authentication.cy.js

describe("Authentication Test", () => {
  it("should log in and retrieve XML data", () => {
    const username = Cypress.env("username");
    const password = Cypress.env("password");

    cy.log(`Username: ${username}`);
    cy.log(`Password: ${password}`);

    cy.request({
      method: "GET",
      url: "/odata/v2/Items", // Use a relative URL since the base URL is provided in the Cypress configuration
      auth: {
        username: username,
        password: password,
      },
      responseType: "text", // Set the response type to 'text' to receive the XML as a string
    }).then((response) => {
      const xmlData = response.body;

      // Save the XML data as a file
      const filePath = "public/test.txt";
      cy.writeFile(filePath, xmlData, "utf-8").then(() => {
        cy.log(`XML data saved: ${filePath}`);
      });
    });
  });
});
