const express = require("express");
const app = express();
const path = require("path");
const cypress = require("cypress");
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // Add this line to parse JSON data in the request body
app.use(express.static(path.join(__dirname, "img")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

let isTestRunning = false; // Variable to track if a test is already running

app.post("/run-authentication-test", (req, res) => {
  // Check if a test is already running
  if (isTestRunning) {
    return res.status(400).json({
      message: "A test is already running. Please wait for it to finish.",
    });
  }

  const { username, password } = req.body; // Retrieve username and password from the request body

  // Pass username and password as environment variables to the Cypress test
  process.env.CYPRESS_USERNAME = username;
  process.env.CYPRESS_PASSWORD = password;

  // Set the test running flag to true
  isTestRunning = true;

  // Emit a signal to all connected clients that a test is starting
  io.sockets.emit("test-started");
  console.log("Sent test-started event to all connected clients");

  // Run the Cypress test
  cypress
    .run({
      config: {
        baseUrl: "https://odata.ikentoo.com",
        env: {
          username: process.env.CYPRESS_USERNAME,
          password: process.env.CYPRESS_PASSWORD,
        },
      },
      spec: "cypress/e2e/authentication.cy.js",
    })
    .then((results) => {
      const { totalFailed, totalPassed } = results;

      if (totalFailed === 0) {
        res.sendFile(path.join(__dirname, "public/test.txt")); // Send the file as a response
      } else {
        res.status(500).send("Authentication test failed");
      }

      // Emit a signal to all connected clients that the test has finished
      io.emit("test-finished");
      console.log("Sent test-finished event to all connected clients");

      // Set the test running flag to false once the test is complete
      isTestRunning = false;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Failed to execute Cypress test");

      // Emit a signal to all connected clients that the test has finished
      io.emit("test-finished");
      console.log("Sent test-finished event to all connected clients");

      // Set the test running flag to false in case of an error
      isTestRunning = false;
    });
});

http.listen(3000, () => {
  console.log("Server listening on port 3000");
});

// Event listeners for test-started and test-finished events
io.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("test-started", () => {
    console.log("Received test-started event from client");
  });

  socket.on("test-finished", () => {
    console.log("Received test-finished event from client");
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});
