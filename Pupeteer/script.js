const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the username and password
  const username = 'DEVELOPER+doppiomalto@norival.com';
  const password = 'NORIVAL#2023';

  // Encode the username and password
  const encodedUsername = encodeURIComponent(username);
  const encodedPassword = encodeURIComponent(password);

  // Navigate to the URL and pass the credentials in the URL
  const url = `https://${encodedUsername}:${encodedPassword}@odata.ikentoo.com/odata/v2/Items`;
  await page.goto(url);

  // Retrieve XML data
  const xmlData = await page.content();

  // Save the XML data to a file
  const filePath = 'output.txt';
  fs.writeFile(filePath, xmlData, 'utf-8', (err) => {
    if (err) {
      throw new Error(`Failed to save file: ${err.message}`);
    }
    console.log(`XML file saved: ${filePath}`);
  });

  await browser.close();
})();