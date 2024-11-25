const fs = require("fs");
const path = require("path");

// Function to convert TXT to a single-line CSV
function convertTxtToSingleLineCsv(inputFilePath, outputFilePath) {
  // Read the input .txt file
  fs.readFile(inputFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err.message}`);
      return;
    }

    // Split the data by lines, trim whitespace, and filter empty lines
    const lines = data
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    // Join the lines with commas and add a trailing comma
    const csvContent = lines.join(",") + ",";

    // Write the output to a .csv file
    fs.writeFile(outputFilePath, csvContent, "utf8", (err) => {
      if (err) {
        console.error(`Error writing file: ${err.message}`);
        return;
      }
      console.log(`CSV file successfully created: ${outputFilePath}`);
    });
  });
}

// File paths
const inputFilePath = path.join(__dirname, "code.txt"); // Replace with your .txt file path
function getFormattedFileName() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, '0');

  // Format time
  let hour = now.getHours();
  const isPM = hour >= 12;
  const period = isPM ? 'pm' : 'am';
  hour = hour % 12 || 12; // Convert to 12-hour format and handle midnight (0 -> 12)

  return `code_${day}_${hour}_${period}.csv`;
}

// Generate the output file path
const outputFilePath = path.join(__dirname, getFormattedFileName());
console.log(`Output file path: ${outputFilePath}`);

// Convert the file
convertTxtToSingleLineCsv(inputFilePath, outputFilePath);
