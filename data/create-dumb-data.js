import fs from "node:fs";
import path from "node:path";

// module files does not have __dirname global variable, so this is the work around it
const __DIRNAME = import.meta.dirname;

const generateValue = () => {
  return 1000 * Math.random();
};

const create = (id) => {
  return JSON.stringify({
    id: id.toString(),
    timestamp: new Date().toISOString(),
    value: generateValue().toFixed(2),
  });
};

const MOCK_DATA = 10000;


// when trying to append to a file do not use writeFile or appendFile
// this creates a single file handler
const stream = fs.createWriteStream(path.join(__DIRNAME, "/data.json"), {
  // the 'a' flags instead for Appending
  flags: "a",
});

stream.write("[\n");
for (let i = 1; i <= MOCK_DATA; i++) {
  const data = create(i);
  
  //
  stream.write(data + ",\n");
}
stream.end("]");
