import fs from "fs";
import path from "path";
import { performance } from "perf_hooks";

// Configuration
const DEFAULT_FILE = "./big-data.json";
const DEFAULT_SIZE = "1GB";
const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

// Parse arguments
const [filePath, sizeInput] = process.argv.slice(2) || [
  DEFAULT_FILE,
  DEFAULT_SIZE,
];

// Size conversion
const sizeUnits = {
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
};

const parseSize = (input) => {
  const match = input.match(/^(\d+(?:\.\d+)?)\s*([KMG]?B?)$/i);
  if (!match) throw new Error("Invalid size format");

  const value = parseFloat(match[1]);
  const unit = match[2].replace(/B?$/, "B").toUpperCase();
  return value * (sizeUnits[unit] || 1);
};

let targetBytes = sizeUnits.GB * 2;
// try {
//   targetBytes = parseSize(sizeInput);
// } catch (e) {
//   console.error("Invalid size format. Use examples: 500MB, 2GB, 100KB");
//   process.exit(1);
// }

// Data generation helpers
let currentId = 1;
const makeDummyObject = () => ({
  id: currentId++,
  name: `User_${Math.random().toString(36).slice(2, 10)}`,
  email: `dummy${currentId}@example.com`,
  active: Math.random() > 0.5,
  // metadata: {
  //   createdAt: new Date().toISOString(),
  //   version: Math.floor(Math.random() * 10),
  //   tags: ["test", "dummy", "data"],
  // },
  content: Buffer.alloc(Math.floor(Math.random() * 500), "x").toString(),
});

// Create write stream
const outputPath = path.join(import.meta.dirname, "really-big-file.json");
const stream = fs.createWriteStream(
  path.join(import.meta.dirname, "really-big-file.json")
);
let bytesWritten = 0;
let firstEntry = true;
const startTime = performance.now();

// Write initial array bracket
stream.write("[\n");

// Progress tracking
let lastProgress = 0;
const updateProgress = () => {
  const percent = ((bytesWritten / targetBytes) * 100).toFixed(1);
  const elapsed = (performance.now() - startTime) / 1000;
  const mbWritten = (bytesWritten / sizeUnits.MB).toFixed(2);
  console.log(
    `${percent}% complete (${mbWritten} MB written in ${elapsed.toFixed(1)}s)`
  );
};

// Generator function for JSON entries
async function generateData() {
  while (bytesWritten < targetBytes) {
    const entries = [];
    let chunkSize = 0;

    // Build chunk of entries
    while (chunkSize < CHUNK_SIZE && bytesWritten + chunkSize < targetBytes) {
      const entry = JSON.stringify(makeDummyObject());
      const separator = firstEntry ? "\n" : ",\n";
      const fullEntry = `${separator}  ${entry}`;

      entries.push(fullEntry);
      chunkSize += Buffer.byteLength(fullEntry);
      firstEntry = false;
    }

    // Write chunk
    const writeOk = stream.write(entries.join(""));
    bytesWritten += chunkSize;

    // Update progress every 500ms
    if (Date.now() - lastProgress > 500) {
      updateProgress();
      lastProgress = Date.now();
    }

    // Handle backpressure
    if (!writeOk) {
      await new Promise((resolve) => stream.once("drain", resolve));
    }
  }

  // Finalize JSON
  stream.write("\n]");
  stream.end();
}

// Handle completion/errors
stream.on("finish", () => {
  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
  console.log(`\nDone! Created ${(bytesWritten / sizeUnits.GB).toFixed(2)} GB`);
  console.log(`File: ${outputPath}`);
  console.log(`Time: ${elapsed}s`);
});

stream.on("error", (err) => {
  console.error("\nError:", err);
  process.exit(1);
});

// Start generation
generateData();
