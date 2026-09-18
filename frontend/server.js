/**
 * Static file server for the Kinntegra Angular build (lift-and-shift).
 * Serves the compiled Angular app on :3000 with SPA history fallback.
 * The Emergent ingress sends all non-/api traffic here.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const DIST = "/app/kinntegra-webapp/dist/kinntegrawebapp/browser";
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".map": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".wasm": "application/wasm",
};

function send(res, status, headers, stream) {
  res.writeHead(status, headers);
  if (stream) stream.pipe(res);
  else res.end();
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  send(res, 200, { "Content-Type": type }, fs.createReadStream(filePath));
}

const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/") urlPath = "/index.html";

    // Prevent path traversal.
    const safePath = path.normalize(path.join(DIST, urlPath));
    if (!safePath.startsWith(DIST)) {
      send(res, 403, { "Content-Type": "text/plain" });
      return res.end("Forbidden");
    }

    fs.stat(safePath, (err, stat) => {
      if (!err && stat.isFile()) {
        return serveFile(res, safePath);
      }
      // SPA fallback -> index.html
      const index = path.join(DIST, "index.html");
      fs.stat(index, (e2) => {
        if (e2) {
          send(res, 404, { "Content-Type": "text/plain" });
          return res.end("Not found (build missing)");
        }
        serveFile(res, index);
      });
    });
  } catch (e) {
    send(res, 500, { "Content-Type": "text/plain" });
    res.end("Server error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Kinntegra webapp static server on http://${HOST}:${PORT} (dist: ${DIST})`);
});
