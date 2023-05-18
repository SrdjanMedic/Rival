function executeAuthenticationTest() {
  const socket = io();
  console.log("Executing authentication test");

  const authButton = document.getElementById("run-authentication-button");
  const statusMessage = document.getElementById("status-message");

  authButton.disabled = true;
  authButton.classList.add("disabled");
  authButton.textContent = "Test in progress...";
  statusMessage.textContent = "Running authentication test...";
  statusMessage.style.display = "block";

  socket.emit("test-started");
  console.log("Sent test-started event to server");

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const requestBody = JSON.stringify({ username, password });

  fetch("/run-authentication-test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  })
    .then((response) => {
      socket.emit("test-finished");
      console.log("Sent test-finished event to server");
      if (response.ok) {
        return response.blob();
      } else {
        throw new Error("Failed to execute authentication test");
      }
    })
    .then((blob) => {
      console.log(blob);

      const resultMessage = document.getElementById("result-message");
      const imageContainer = document.getElementById("image-container");
      const downloadButton = document.getElementById("download-button");

      resultMessage.textContent = "";
      imageContainer.innerHTML = "";

      if (blob) {
        const happyImage = document.createElement("img");
        happyImage.src = "img/NicoHappy.png";
        happyImage.alt = "Happy Image";
        happyImage.style.maxWidth = "100%";
        imageContainer.appendChild(happyImage);

        downloadButton.style.display = "block";
        setDownloadURL(downloadButton, blob);
      } else {
        const sadImage = document.createElement("img");
        sadImage.src = "img/NicoSad.png";
        sadImage.alt = "Sad Image";
        sadImage.style.maxWidth = "100%";
        imageContainer.appendChild(sadImage);

        downloadButton.style.display = "none";
      }

      const loadingContainer = document.getElementById("loading-container");
      const resultContainer = document.getElementById("result-container");

      loadingContainer.style.display = "none";
      resultContainer.style.display = "block";
      resultMessage.textContent = "Authentication test executed successfully";

      authButton.disabled = false;
      authButton.classList.remove("disabled");
      authButton.textContent = "Run Authentication Test";

      statusMessage.style.display = "none";

      // Emit a signal to the server that the test has finished
      socket.emit("test-finished");
      console.log("Sent test-finished event to server");
    })
    .catch((error) => {
      console.error(error);

      socket.emit("test-finished");
      console.log("Sent test-finished event to server");

      const resultMessage = document.getElementById("result-message");
      const imageContainer = document.getElementById("image-container");
      const downloadButton = document.getElementById("download-button");

      resultMessage.textContent = "";
      imageContainer.innerHTML = "";

      const sadImage = document.createElement("img");
      sadImage.src = "img/NicoSad.png";
      sadImage.alt = "Sad Image";
      sadImage.style.maxWidth = "100%";
      imageContainer.appendChild(sadImage);

      downloadButton.style.display = "none";

      const loadingContainer = document.getElementById("loading-container");
      const resultContainer = document.getElementById("result-container");

      loadingContainer.style.display = "none";
      resultContainer.style.display = "block";
      resultMessage.textContent = "Authentication test failed";

      authButton.disabled = false;
      authButton.classList.remove("disabled");
      authButton.textContent = "Run Authentication Test";

      statusMessage.style.display = "none";
    })
    .finally(() => {
      authButton.disabled = false;
    });
}

const socket = io();
socket.on("test-started", function () {
  const authButton = document.getElementById("run-authentication-button");
  const statusMessage = document.getElementById("status-message");

  authButton.disabled = true;
  authButton.classList.add("disabled");
  authButton.textContent = "Test in progress...";
  statusMessage.textContent = "Running authentication test...";
  statusMessage.style.display = "block";
});

socket.on("test-finished", function () {
  const authButton = document.getElementById("run-authentication-button");
  const statusMessage = document.getElementById("status-message");

  authButton.disabled = false;
  authButton.classList.remove("disabled");
  authButton.textContent = "Run Authentication Test";
  statusMessage.style.display = "none";
});
