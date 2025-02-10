import http from "node:http";
import path from "node:path";
import * as fs from "node:fs";

const __DIRNAME = import.meta.dirname;
const DEFAULT_PORT = 8080;
const PORT = process.env.PORT || DEFAULT_PORT;

function onRequest(request, response) {
  console.log("request", request);
  if (request.method === "GET" && request.url === "/") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/html");
    fs.createReadStream(path.join(__DIRNAME, "/public/index.html"))
      .pipe(response)
      .on("close", () => response.end());
  } else if (request.method === "GET" && request.url === "/streams") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    fs.createReadStream(path.join(__DIRNAME, "/data.json"))
      .pipe(response)
      .on("close", () => response.end());
  } else {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/html");
    fs.createReadStream(path.join(__DIRNAME, "/public/not_found.html"))
      .pipe(response)
      .on("close", () => response.end());
  }
}

const server = http.createServer();

server.on("request", onRequest);
server.listen(PORT, () =>
  console.log("Server listening on", `http://localhost:${PORT}/`)
);
