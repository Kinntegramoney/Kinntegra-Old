# Fix the live "Request timeout" error on Azure — instructions

The error `Error: Request timeout at commonfunction.model.js:383` happens because a
call to BSE StarMF was given only 30 seconds to respond. When BSE is slow, it fails.
This fix (a) gives it more time and makes the time adjustable, (b) writes a clearer
error saying WHICH endpoint timed out, and (c) makes sure one slow call can never
crash the whole app.

There are TWO changed files in this folder (already fixed, ready to use):
  1. app/models/commonfunction.model.js
  2. index.js

------------------------------------------------------------------------------------
WHAT CHANGED (in case your developer prefers to edit by hand)
------------------------------------------------------------------------------------

FILE 1 — app/models/commonfunction.model.js  (inside function CommonFunction.SendRequest)

  BEFORE:
      req.setTimeout(30000, () => {
          req.destroy(new Error("Request timeout"));
      });

  AFTER:
      const timeoutMs = parseInt(process.env.REQUEST_TIMEOUT_MS, 10)
          || options.timeout || 30000;
      ...
      req.setTimeout(timeoutMs, () => {
          const target = (options.host || "") + (options.path || "");
          req.destroy(new Error("Request timeout after " + timeoutMs + "ms for " + target));
      });

  (The `const timeoutMs = ...` line goes just before the `https.request(...)` call.)

  >> SIMPLEST possible version if you don't want the env variable: just change the
     number 30000 to 60000 on that one line. That alone gives BSE 60 seconds.

FILE 2 — index.js  (add these lines at the very TOP, right after require("dotenv").config();)

      process.on("unhandledRejection", (reason) => {
          console.error("[unhandledRejection]", reason && reason.message ? reason.message : reason);
      });
      process.on("uncaughtException", (err) => {
          console.error("[uncaughtException]", err && err.message ? err.message : err);
      });

------------------------------------------------------------------------------------
NEW SETTING (only needed if you used the env-variable version of File 1)
------------------------------------------------------------------------------------
Add an Application Setting on the Azure App Service:
      REQUEST_TIMEOUT_MS = 60000
(Azure Portal -> your App Service -> Settings -> Configuration -> Application settings
 -> New application setting -> Save. This restarts the app.)

------------------------------------------------------------------------------------
HOW TO PUT THE FILES ON AZURE (pick ONE)
------------------------------------------------------------------------------------
A) The proper way (recommended): if your app deploys from GitHub / Azure DevOps / a
   Git repo, replace these two files in that repo, commit, and let your normal deploy run.

B) Quick direct edit (no repo): Azure Portal -> your App Service (the API app) ->
   Development Tools -> "Advanced Tools" (Kudu) -> "Go" -> Debug console -> CMD ->
   navigate to  site/wwwroot  -> open/replace:
       site/wwwroot/index.js
       site/wwwroot/app/models/commonfunction.model.js
   Then restart the App Service (Overview -> Restart).

Nothing else changes — your database and firewall stay exactly as they are.
