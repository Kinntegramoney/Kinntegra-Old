"""
Kinntegra backend on :8001.

Serves the NEW React rewrite's native endpoints under /api/v2/* (talking directly
to the live Azure SQL database), and reverse-proxies everything else to the original
Node/Express API on :8080 so the existing Angular app keeps working unchanged.
"""
import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv

load_dotenv()

import jwt  # noqa: E402
import pymssql  # noqa: E402
import httpx  # noqa: E402
from fastapi import FastAPI, Request, Header, HTTPException  # noqa: E402
from fastapi.responses import StreamingResponse, JSONResponse  # noqa: E402
from pydantic import BaseModel  # noqa: E402
from starlette.background import BackgroundTask  # noqa: E402

import kinn_crypto as crypto  # noqa: E402

NODE_API = os.environ.get("NODE_API_URL", "http://127.0.0.1:8080")
TOKEN_KEY = os.environ["TOKEN_KEY"]

app = FastAPI(title="Kinntegra API")

_timeout = httpx.Timeout(600.0, connect=15.0)
_client = httpx.AsyncClient(timeout=_timeout, follow_redirects=False)

_HOP = {
    "content-length", "transfer-encoding", "connection", "keep-alive",
    "proxy-authenticate", "proxy-authorization", "te", "trailers", "upgrade",
}


# --------------------------------------------------------------------------- #
# Database helpers
# --------------------------------------------------------------------------- #
def get_conn():
    return pymssql.connect(
        server=os.environ["AZURE_SQL_SERVER"],
        user=os.environ["AZURE_SQL_USERNAME"],
        password=os.environ["AZURE_SQL_PASSWORD"],
        database=os.environ["AZURE_SQL_DATABASE"],
        port=1433,
        login_timeout=30,
        timeout=90,
        autocommit=True,
    )


# --------------------------------------------------------------------------- #
# JWT helpers (compatible with the Node service: HS256, same TOKEN_KEY)
# --------------------------------------------------------------------------- #
def make_mid_token(user_id_enc: str, user_name: str) -> str:
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {"user_id": user_id_enc, "user_name": user_name, "iat": now,
         "exp": now + timedelta(hours=1)},
        TOKEN_KEY, algorithm="HS256",
    )


def make_final_token(user_id_enc, user_name, user_role, associate_id, employee_id, client_id) -> str:
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {"user_id": user_id_enc, "user_name": user_name, "user_role": user_role,
         "associate_id": associate_id, "employee_id": employee_id, "client_id": client_id,
         "iat": now, "exp": now + timedelta(hours=8)},
        TOKEN_KEY, algorithm="HS256",
    )


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, TOKEN_KEY, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid session...")


def require_claims(x_access_token: str | None) -> dict:
    if not x_access_token:
        raise HTTPException(status_code=403, detail="Invalid request...")
    return decode_token(x_access_token)


# --------------------------------------------------------------------------- #
# Models
# --------------------------------------------------------------------------- #
class LoginBody(BaseModel):
    UserName: str
    Password: str


class PinBody(BaseModel):
    Token: str
    Pin: str


# --------------------------------------------------------------------------- #
# /api/v2 auth
# --------------------------------------------------------------------------- #
@app.post("/api/v2/auth/login")
def v2_login(body: LoginBody):
    conn = get_conn()
    try:
        cur = conn.cursor(as_dict=True)
        cur.execute(
            "EXEC AuthenticateAppUser @UserName=%s, @Password=%s",
            (body.UserName, crypto.encrypt(body.Password, True)),
        )
        rows = cur.fetchall()
        if not rows:
            return {"Status": False, "Message": "Invalid email or password."}
        user_id = rows[0]["Id"]
        token = make_mid_token(crypto.param_encrypt(user_id, True), body.UserName)
        return {"Status": True, "Data": {"Token": token}}
    finally:
        conn.close()


@app.post("/api/v2/auth/verify-pin")
def v2_verify_pin(body: PinBody):
    mid = decode_token(body.Token)
    user_id = crypto.param_decrypt(mid["user_id"], True)

    conn = get_conn()
    try:
        cur = conn.cursor(as_dict=True)
        cur.execute(
            "EXEC AuthenticateAppUserPin @Id=%s, @Pin=%s",
            (user_id, crypto.encrypt(body.Pin, True)),
        )
        rows = cur.fetchall()
        if not rows:
            return {"Status": False, "Message": "Invalid PIN."}
        user_data = rows[0]

        associate_id = crypto.param_encrypt("0", True)
        employee_id = crypto.param_encrypt("0", True)
        client_id = crypto.param_encrypt("0", True)
        user_role = "SA"
        display_name = "Super Admin"
        is_primary_associate = False

        # best-effort login log
        try:
            logcur = conn.cursor(as_dict=True)
            logcur.execute("EXEC InsertLoginLog @AppUserId=%s", (user_data["Id"],))
        except Exception:
            pass

        # role resolution: associate -> employee -> client (mirrors Node)
        acur = conn.cursor(as_dict=True)
        acur.execute("EXEC GetAppUserAssociate @AppUserId=%s", (user_id,))
        arows = acur.fetchall()
        if arows:
            a = arows[0]
            associate_id = crypto.param_encrypt(a["AssociateId"], True)
            user_role = "Associate"
            display_name = a["Name"] if not a.get("EntityName") else a["EntityName"]
            is_primary_associate = bool(a.get("IsPrimaryAssociate"))

        if user_role != "Associate":
            ecur = conn.cursor(as_dict=True)
            ecur.execute("EXEC GetAppUserEmployee @AppUserId=%s", (user_id,))
            erows = ecur.fetchall()
            if erows:
                e = erows[0]
                employee_id = crypto.param_encrypt(e["EmployeeId"], True)
                associate_id = crypto.param_encrypt(e["AssociateId"], True)
                user_role = "Employee"
                display_name = e["Name"]
                is_primary_associate = bool(e.get("IsPrimaryAssociate"))

        if user_role not in ("Associate", "Employee"):
            ccur = conn.cursor(as_dict=True)
            ccur.execute("EXEC GetAppUserClient @AppUserId=%s", (user_id,))
            crows = ccur.fetchall()
            if crows:
                cl = crows[0]
                client_id = crypto.param_encrypt(cl["ClientId"], True)
                associate_id = crypto.param_encrypt(cl["AssociateId"], True)
                user_role = "Client"
                display_name = cl["Name"]

        token = make_final_token(
            crypto.param_encrypt(user_data["Id"], True),
            user_data["UserName"], user_role, associate_id, employee_id, client_id,
        )
        return {"Status": True, "Data": {
            "Token": token, "Role": user_role, "AssociateId": associate_id,
            "EmployeeId": employee_id, "ClientId": client_id,
            "UserDisplayName": display_name, "IsPrimaryAssociate": is_primary_associate,
            "UserId": crypto.param_encrypt(user_id, True),
        }}
    finally:
        conn.close()


@app.get("/api/v2/me")
def v2_me(x_access_token: str | None = Header(default=None)):
    claims = require_claims(x_access_token)
    return {
        "Status": True,
        "Data": {
            "UserName": claims.get("user_name"),
            "UserRole": claims.get("user_role"),
            "UserId": crypto.param_decrypt(claims["user_id"], True),
        },
    }


# --------------------------------------------------------------------------- #
# /api/v2 dashboard (direct Azure SQL reads)
# --------------------------------------------------------------------------- #
def _dashboard_user_id(x_access_token: str | None) -> str:
    claims = require_claims(x_access_token)
    return crypto.param_decrypt(claims["user_id"], True)


@app.get("/api/v2/dashboard/clientcount")
def v2_client_count(x_access_token: str | None = Header(default=None)):
    uid = _dashboard_user_id(x_access_token)
    conn = get_conn()
    try:
        cur = conn.cursor(as_dict=True)
        cur.execute("EXEC GetDashboardClientCount @AppUserId=%s", (uid,))
        return {"Status": True, "Message": "", "Data": cur.fetchall()}
    finally:
        conn.close()


@app.get("/api/v2/dashboard/clientchart")
def v2_client_chart(x_access_token: str | None = Header(default=None)):
    uid = _dashboard_user_id(x_access_token)
    conn = get_conn()
    try:
        cur = conn.cursor(as_dict=True)
        cur.execute("EXEC GetDashboardClientChartDataCount @AppUserId=%s", (uid,))
        return {"Status": True, "Message": "", "Data": cur.fetchall()}
    finally:
        conn.close()


@app.get("/api/v2/dashboard/tradelogstatus")
def v2_tradelog_status(x_access_token: str | None = Header(default=None)):
    uid = _dashboard_user_id(x_access_token)
    as_on = datetime.now(timezone.utc).astimezone(
        timezone(timedelta(hours=5, minutes=30))
    ).strftime("%Y-%m-%d")
    conn = get_conn()
    try:
        cur = conn.cursor(as_dict=True)
        cur.execute(
            "EXEC GetDashboardTradeLogStatusChartDataCount @AppUserId=%s, @AsOnDate=%s",
            (uid, as_on),
        )
        return {"Status": True, "Message": "", "Data": cur.fetchall()}
    finally:
        conn.close()


@app.get("/api/v2/health")
def v2_health():
    return {"status": "ok"}


# --------------------------------------------------------------------------- #
# Catch-all reverse proxy to the Node API (keeps the Angular app working)
# --------------------------------------------------------------------------- #
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
        request.method, url, headers=headers, content=body, params=request.query_params,
    )
    upstream = await _client.send(req, stream=True)
    resp_headers = {k: v for k, v in upstream.headers.items() if k.lower() not in _HOP}
    return StreamingResponse(
        upstream.aiter_raw(),
        status_code=upstream.status_code,
        headers=resp_headers,
        background=BackgroundTask(upstream.aclose),
    )


@app.exception_handler(pymssql.Error)
async def _sql_error_handler(request: Request, exc: pymssql.Error):
    return JSONResponse(status_code=500, content={"Status": False, "Message": "Database error."})


@app.on_event("shutdown")
async def _shutdown():
    await _client.aclose()
