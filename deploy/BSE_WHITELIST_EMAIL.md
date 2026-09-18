To: BSE StarMF Support / Integration Team (bsestarmf@bseindia.com or your assigned integration contact)
Cc: shashikantv@kinntegra.co.in
Subject: Urgent: Secure API (port 443) connection blocked from our server — please whitelist our outbound IPs

Dear BSE StarMF Support Team,

We are writing regarding a connectivity issue between our application server and the BSE StarMF Secure API at https://www.bsestarmf.in (port 443). Since recently, all secure API calls from our server are timing out, which is causing both order entry and UCC registration to fail.

Our technical team has run detailed diagnostics from our production server, and the evidence clearly points to our server's outbound IP address no longer being whitelisted on your Secure API (port 443) firewall:

- DNS resolves correctly: www.bsestarmf.in -> 43.228.176.243
- Our general internet connectivity is healthy (other HTTPS sites connect in ~11 ms)
- Port 80 of www.bsestarmf.in connects normally (~40 ms; returns the 307 redirect to https)
- Port 443 (the Secure API) is silently dropped — the connection never completes (SYN sent, no response), timing out after ~12 seconds on every attempt

Because port 80 connects but port 443 does not — from the same BSE server IP — this indicates our outbound IP is not permitted on your Secure API (443) allowlist.

Affected endpoints:
- https://www.bsestarmf.in/MFOrderEntry/MFOrder.svc/Secure  (Order Entry)
- https://www.bsestarmf.in/BSEMFWEBAPI/UCCAPI/UCCRegistrationV183  (UCC Registration)

Test timestamp: 18-Sep-2026, 23:21 IST (17:51 UTC) — port 443 timed out 3/3 attempts.

Our server is hosted on Microsoft Azure, which can send outbound traffic from any IP in the set below. Kindly whitelist all of the following IP addresses for the Secure API (port 443):

Currently active outbound IPs (minimum required):
20.207.68.143
20.207.69.99
20.207.69.107
20.219.168.55
20.219.170.81
20.219.171.95
20.192.170.13

Full possible outbound IP set (recommended, to prevent future recurrence):
20.219.172.33, 20.219.172.222, 20.219.172.232, 20.219.172.234, 20.219.173.8,
20.219.173.11, 20.204.238.158, 20.204.238.240, 20.204.239.24, 20.204.239.60,
20.204.239.243, 20.207.65.31, 20.207.65.117, 20.207.65.233, 20.207.66.77,
20.207.66.144, 20.207.66.178, 20.207.68.21, 20.207.68.143, 20.207.69.99,
20.207.69.107, 20.219.168.55, 20.219.170.81, 20.219.171.95, 20.219.173.16,
20.219.173.22, 20.219.173.67, 20.219.173.80, 20.219.173.108, 20.219.173.119,
20.192.170.13

Could you please also confirm:
1. Which of our IP addresses do you currently have whitelisted for the Secure API? (We suspect it is an older IP that our server no longer uses.)
2. That there is no ongoing BSE-side service incident or recent IP-restriction change on www.bsestarmf.in:443.

This is affecting live client transactions, so we would greatly appreciate a priority resolution. Please let us know once the whitelisting is updated, and we will re-test immediately.

Thank you for your support.

Best regards,
Shashikant V
Kinntegra Wealth Private Limited
shashikantv@kinntegra.co.in
