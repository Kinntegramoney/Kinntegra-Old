/**
 * Frontend server for the Kinntegra Angular build (lift-and-shift).
 *
 * Responsibilities on :3000 (the "everything except /api" origin):
 *   1. Serve the compiled Angular app with SPA history fallback.
 *   2. Reverse-proxy the Node API's static file paths (/images, /doc, /download)
 *      to the Node API on 127.0.0.1:8080 so document/report/image downloads work.
 *   3. Host the socket.io realtime relay (same origin, default /socket.io path) so
 *      the browser gets live notifications / order-progress updates. The Node API
 *      connects to this relay as a client via REAL_COMM_LINK (http://localhost:3000).
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { Server } = require("socket.io");

const DIST = "/app/kinntegra-webapp/dist/kinntegrawebapp/browser";
const REACT_BUILD = "/app/frontend/build";
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const NODE_API_HOST = "127.0.0.1";
const NODE_API_PORT = 8080;

// Path prefixes served by the Node/Express API as static files.
const PROXY_PREFIXES = ["/images", "/doc", "/download"];

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

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type });
  fs.createReadStream(filePath).pipe(res);
}

function proxyToNode(req, res) {
  const options = {
    host: NODE_API_HOST,
    port: NODE_API_PORT,
    method: req.method,
    path: req.url,
    headers: Object.assign({}, req.headers, { host: NODE_API_HOST + ":" + NODE_API_PORT }),
  };
  const upstream = http.request(options, (up) => {
    res.writeHead(up.statusCode || 502, up.headers);
    up.pipe(res);
  });
  upstream.on("error", (err) => {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end("Bad gateway: " + err.message);
  });
  req.pipe(upstream);
}

function serveSpa(res, baseDir, relPath) {
  let urlPath = decodeURIComponent(relPath);
  if (urlPath === "" || urlPath === "/") urlPath = "/index.html";
  const safePath = path.normalize(path.join(baseDir, urlPath));
  if (!safePath.startsWith(baseDir)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    return res.end("Forbidden");
  }
  fs.stat(safePath, (err, stat) => {
    if (!err && stat.isFile()) return serveFile(res, safePath);
    const index = path.join(baseDir, "index.html");
    fs.stat(index, (e2) => {
      if (e2) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("Not found (build missing)");
      }
      serveFile(res, index);
    });
  });
}

function requestHandler(req, res) {
  try {
    const urlPath0 = req.url.split("?")[0];

    // 1. Proxy the Node API's static file routes.
    if (PROXY_PREFIXES.some((p) => urlPath0 === p || urlPath0.startsWith(p + "/"))) {
      return proxyToNode(req, res);
    }

    // 2. New React rewrite served under /next (Angular stays at root).
    if (urlPath0 === "/next" || urlPath0.startsWith("/next/")) {
      return serveSpa(res, REACT_BUILD, urlPath0.slice("/next".length) || "/");
    }

    // 3. Serve Angular build (with SPA fallback).
    serveSpa(res, DIST, urlPath0);
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Server error");
  }
}

const server = http.createServer(requestHandler);

// 3. Socket.io realtime relay (mirrors the original realcommunication service).
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });
io.on("connection", (socket) => {
  console.log("socket connected: " + socket.id);
  socket.on("sendmessage", (msg) => {
    io.emit("receivemessage", msg);
  });
  socket.on("reportorderprogress", (msg) => {
    io.emit("receiveorderprogress", msg);
  });
  socket.on("disconnect", () => {
    console.log("socket disconnected: " + socket.id);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Kinntegra frontend+relay on http://${HOST}:${PORT} (dist: ${DIST})`);
});
