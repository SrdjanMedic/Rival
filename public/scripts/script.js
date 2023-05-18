function executeAuthenticationTest() {
  console.log("Executing authentication test");

  // Retrieve username and password from the input fields
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Display loading message
  const loadingContainer = document.getElementById("loading-container");
  loadingContainer.style.display = "block";

  // Hide result container
  const resultContainer = document.getElementById("result-container");
  resultContainer.style.display = "none";

  // Disable the authentication test button
  const authButton = document.getElementById("run-authentication-button");
  authButton.disabled = true;
  authButton.classList.add("disabled");
  authButton.textContent = "Test in progress...";

  // Create the request body with username and password
  const requestBody = JSON.stringify({ username, password });

  fetch("/run-authentication-test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  })
    .then((response) => {
      if (response.ok) {
        return response.blob();
      } else {
        throw new Error("Failed to execute authentication test");
      }
    })
    .then((blob) => {
      console.log(blob);

      // Clear the result container
      const resultMessage = document.getElementById("result-message");
      const imageContainer = document.getElementById("image-container");
      const downloadButton = document.getElementById("download-button");

      resultMessage.textContent = "";
      imageContainer.innerHTML = "";

      if (blob) {
        // Append the happy image
        const happyImage = document.createElement("img");
        happyImage.src = "img/NicoHappy.png";
        happyImage.alt = "Happy Image";
        happyImage.style.maxWidth = "100%";
        imageContainer.appendChild(happyImage);

        // Show the download button
        downloadButton.style.display = "block";

        // Set the download URL and filename
        setDownloadURL(downloadButton, blob);
      } else {
        // Append the sad image
        const sadImage = document.createElement("img");
        sadImage.src = "img/NicoSad.png";
        sadImage.alt = "Sad Image";
        sadImage.style.maxWidth = "100%";
        imageContainer.appendChild(sadImage);

        // Hide the download button
        downloadButton.style.display = "none";
      }

      // Hide loading message and display result container
      loadingContainer.style.display = "none";
      resultContainer.style.display = "block";
      resultMessage.textContent = "Authentication test executed successfully";
    })
    .catch((error) => {
      console.error(error);

      // Clear the result container
      const resultMessage = document.getElementById("result-message");
      const imageContainer = document.getElementById("image-container");
      const downloadButton = document.getElementById("download-button");

      resultMessage.textContent = "";
      imageContainer.innerHTML = "";

      // Append the sad image
      const sadImage = document.createElement("img");
      sadImage.src = "img/NicoSad.png";
      sadImage.alt = "Sad Image";
      sadImage.style.maxWidth = "100%";
      imageContainer.appendChild(sadImage);

      // Hide the download button
      downloadButton.style.display = "none";

      // Hide loading message and display result container
      loadingContainer.style.display = "none";
      resultContainer.style.display = "block";
      resultMessage.textContent = "Authentication test failed";
    })
    .finally(() => {
      // Enable the authentication test button
      authButton.disabled = false;
      authButton.classList.remove("disabled");
      authButton.textContent = "Run Authentication Test";
    });
}
