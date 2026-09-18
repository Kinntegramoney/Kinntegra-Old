To: BSE StarMF Support / Integration Team (bsestarmf@bseindia.com or your assigned integration contact)
Cc: shashikantv@kinntegra.co.in
Subject: URGENT: Your port 443 endpoint is dropping traffic from our server IP (started ~2 days ago) — please check firewall/WAF block

Dear BSE StarMF Support Team,

Since approximately 2 days ago, ALL our secure API calls to https://www.bsestarmf.in (port 443)
are timing out, which has stopped order entry and UCC registration. We have run detailed
network diagnostics and the evidence shows this is NOT a whitelisting problem on our side, and
NOT a problem with our server's internet. It appears your port-443 endpoint (behind your GSLB,
www.gslb.bsestarmf.in / 43.228.176.243) has started dropping packets specifically from our
server's IP address.

PROOF (all tested within the last hour):

1) From OUR server (Azure, source IP 20.219.168.55):
   - BSE port 443 (www.bsestarmf.in, and its raw IP 43.228.176.243): TCP connection TIMES OUT
     (SYN sent, no SYN-ACK, ~12s) - EVERY attempt.
   - BSE port 80 (same BSE server): connects in ~78 ms (returns your 307 redirect to https).
   - Google port 443: connects in ~7 ms.
   => Our server's outbound HTTPS/443 is perfectly healthy in general; only BSE:443 is dropped.

2) From a COMPLETELY DIFFERENT, unrelated server (a different network, NOT whitelisted anywhere):
   - BSE port 443: connects in ~0.25 s.  BSE port 80: connects in ~0.23 s.
   => Your port 443 is publicly reachable and is NOT whitelist-gated.

CONCLUSION:
- Because an unrelated, non-whitelisted server connects to your 443 fine, this is NOT a missing
  whitelist entry.
- Because only OUR IP is dropped, and only on port 443 (port 80 from us works), your edge/GSLB/
  firewall/WAF is selectively BLOCKING our source IP (or the Microsoft Azure IP range) on port 443.
- This is a BLOCK / blacklist / WAF / geo-or-ASN rule - a different mechanism from the "whitelist"
  that was checked. That is why whitelisting looks fine on your side, yet our traffic is still dropped.

REQUEST:
Please check your firewall / WAF / GSLB / DDoS-protection BLOCK lists for our source IP and remove
any rule blocking it on port 443. Our server is on Microsoft Azure (India) and may egress from any
IP in the list below - please ensure NONE of these are blocked on port 443:

Currently active outbound IPs:
20.207.68.143
20.207.69.99
20.207.69.107
20.219.168.55   <-- confirmed being dropped on 443
20.219.170.81
20.219.171.95
20.192.170.13

Full possible Azure outbound IP set (please ensure none are blocked):
20.219.172.33, 20.219.172.222, 20.219.172.232, 20.219.172.234, 20.219.173.8, 20.219.173.11,
20.204.238.158, 20.204.238.240, 20.204.239.24, 20.204.239.60, 20.204.239.243, 20.207.65.31,
20.207.65.117, 20.207.65.233, 20.207.66.77, 20.207.66.144, 20.207.66.178, 20.207.68.21,
20.207.68.143, 20.207.69.99, 20.207.69.107, 20.219.168.55, 20.219.170.81, 20.219.171.95,
20.219.173.16, 20.219.173.22, 20.219.173.67, 20.219.173.80, 20.219.173.108, 20.219.173.119,
20.192.170.13

Affected endpoints:
- https://www.bsestarmf.in/MFOrderEntry/MFOrder.svc/Secure       (Order Entry)
- https://www.bsestarmf.in/BSEMFWEBAPI/UCCAPI/UCCRegistrationV183 (UCC Registration)

Please also confirm:
1. Whether any new firewall/WAF/GSLB/security rule or Azure-IP-range block was applied on your
   port 443 in the last 2-3 days.
2. Whether there is any DDoS/rate-limit rule that may have auto-blocked our IP.

This is affecting live client transactions - we would appreciate a priority resolution. We will
re-test immediately once the block is removed.

Thank you,
Shashikant V
Kinntegra Wealth Private Limited
shashikantv@kinntegra.co.in
