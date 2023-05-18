function setDownloadURL(downloadButton, blob) {
  // Create a Blob URL for the blob object
  const downloadURL = URL.createObjectURL(blob);

  // Set the download URL as the href attribute of the download button
  downloadButton.href = downloadURL;

  // Set the filename for the download
  downloadButton.setAttribute("download", "test.txt");
}
