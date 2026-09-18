"""
FastAPI reverse proxy for the Kinntegra Node/Express API (lift-and-shift).

The Emergent ingress routes all `/api/*` traffic to this service on :8001.
The original Node backend (kinntegra-api) listens on 127.0.0.1:8080 and already
mounts every route under `/api/...`, so we transparently forward requests to it.
"""
import os
import httpx
from fastapi import FastAPI, Request
from fastapi.responses import Response, StreamingResponse
from starlette.background import BackgroundTask

NODE_API = os.environ.get("NODE_API_URL", "http://127.0.0.1:8080")

app = FastAPI(title="Kinntegra API Proxy")

# Long timeouts: some endpoints generate PDFs / large Excel exports.
_timeout = httpx.Timeout(600.0, connect=15.0)
_client = httpx.AsyncClient(timeout=_timeout, follow_redirects=False)

# Hop-by-hop headers that must not be forwarded.
_HOP = {
    "content-length", "transfer-encoding", "connection", "keep-alive",
    "proxy-authenticate", "proxy-authorization", "te", "trailers", "upgrade",
}


@app.get("/healthz")
async def healthz():
    return {"status": "ok", "upstream": NODE_API}


@app.api_route(
    "/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
)
async def proxy(path: str, request: Request):
    url = f"{NODE_API}/{path}"
    headers = {k: v for k, v in request.headers.items() if k.lower() not in _HOP}
    headers["host"] = "127.0.0.1:8080"
    body = await request.body()

    req = _client.build_request(
        request.method,
        url,
        headers=headers,
        content=body,
        params=request.query_params,
    )
    upstream = await _client.send(req, stream=True)

    resp_headers = {
        k: v for k, v in upstream.headers.items() if k.lower() not in _HOP
    }
    return StreamingResponse(
        upstream.aiter_raw(),
        status_code=upstream.status_code,
        headers=resp_headers,
        background=BackgroundTask(upstream.aclose),
    )


@app.on_event("shutdown")
async def _shutdown():
    await _client.aclose()
