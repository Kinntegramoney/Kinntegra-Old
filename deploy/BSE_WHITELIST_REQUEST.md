# BSE StarMF — Request to whitelist our server IPs (Secure API / port 443)

## Summary of the problem
Our application server (hosted on Microsoft Azure) is **unable to reach the BSE StarMF
secure API** at `https://www.bsestarmf.in` (port 443). Every request times out with no
response. As a result, order entry and UCC registration calls fail with a timeout.

We have proven from our server that:
- DNS resolves correctly: `www.bsestarmf.in` -> `43.228.176.243`
- Our internet connectivity is healthy (other HTTPS sites like Google connect in ~11 ms)
- **Port 80** on `www.bsestarmf.in` connects fine (~40 ms, returns the 307 redirect to https)
- **Port 443** (the secure API) from our server is **silently dropped** — the TCP
  connection never completes (SYN sent, no SYN-ACK), timing out after ~12 seconds, every time.

Because port 80 connects but port 443 does not — from the **same** BSE IP — this indicates
our server's outbound IP address is **not on the allowlist for the BSE Secure API (443)**.

## Affected endpoints
- `https://www.bsestarmf.in/MFOrderEntry/MFOrder.svc/Secure`  (Order Entry)
- `https://www.bsestarmf.in/BSEMFWEBAPI/UCCAPI/UCCRegistrationV183`  (UCC Registration)

## Evidence timestamps (most recent test)
- 2026-09-18 17:51 UTC (2026-09-18 23:21 IST) — BSE:443 TCP connect timed out 3/3 attempts (~12s each)
- Same time — BSE:80 connected in 40 ms; Google:443 connected in 11 ms

## Our server's outbound (public) IP addresses — please whitelist these on port 443
Our current, in-use outbound IP was observed as **20.219.168.55**.

Because Microsoft Azure App Service can send outbound traffic from **any** IP in the set
below, please whitelist **all** of these to make the connection reliable:

### Currently active outbound IPs (minimum required)
```
20.207.68.143
20.207.69.99
20.207.69.107
20.219.168.55
20.219.170.81
20.219.171.95
20.192.170.13
```

### Full possible outbound IP set (recommended — future-proof against Azure IP rotation)
```
20.219.172.33
20.219.172.222
20.219.172.232
20.219.172.234
20.219.173.8
20.219.173.11
20.204.238.158
20.204.238.240
20.204.239.24
20.204.239.60
20.204.239.243
20.207.65.31
20.207.65.117
20.207.65.233
20.207.66.77
20.207.66.144
20.207.66.178
20.207.68.21
20.207.68.143
20.207.69.99
20.207.69.107
20.219.168.55
20.219.170.81
20.219.171.95
20.219.173.16
20.219.173.22
20.219.173.67
20.219.173.80
20.219.173.108
20.219.173.119
20.192.170.13
```

## Questions for BSE
1. Which of our IP addresses do you currently have whitelisted for the Secure API (443)?
   (We suspect it is an old/stale IP that our server no longer uses.)
2. Please whitelist the IPs above for the Secure API endpoints.
3. Please confirm there is no BSE-side service incident or IP-restriction change on
   `www.bsestarmf.in:443`.
