const { execFile } = require('child_process');

// Data to send
const lat = 23.2599;
const lon = 77.4126;
const year = 2024;

// Call Python script
execFile('python', ['extract_data.py', lat, lon, year], (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Error: ${error}`);
    return;
  }
  console.log(`✅ Python output:\n${stdout}`);
});
