# Kinntegra — Azure SQL firewall: 2-minute fix (please help)

We are moving the Kinntegra app to a new hosting environment. The app is fully working
EXCEPT the database is refusing the new server's IP address. Please whitelist it.

## What to do (Azure Portal — easiest)
1. Go to https://portal.azure.com and sign in
   (account: admin@kinntegraazur.onmicrosoft.com — this needs the Microsoft
    Authenticator approval that is set up on your phone).
2. In the top search bar, type: **kinntegra** and click the **SQL server**
   named **kinntegra** (kinntegra.database.windows.net).
   (Pick the "SQL server" resource, NOT the "SQL database".)
3. On the left menu, click **Networking** (older portals: "Firewalls and virtual networks").
4. Under **Firewall rules**, click **+ Add a firewall rule** (or "Add client IP") and enter:
   - Rule name: `emergent`
   - Start IP: `34.170.12.145`
   - End IP:   `34.170.12.145`
5. Click **Save**. Done. (Takes up to 5 minutes to take effect.)

> Note: the IP above is for the temporary preview environment. When the app goes fully
> live we will send you one more (final) IP to whitelist the same way.

## Alternative (if you use Azure CLI)
```
az sql server firewall-rule create \
  --resource-group <the SQL server's resource group> \
  --server kinntegra \
  --name emergent \
  --start-ip-address 34.170.12.145 \
  --end-ip-address 34.170.12.145
```

## Alternative (let the new team's server do it for you — 1 minute, no portal)
If you'd rather not open the portal, the new team can log in on your behalf with a
one-time code. Ask them for a "device code", then:
1. Open https://login.microsoft.com/device
2. Enter the code they give you.
3. Approve the Microsoft Authenticator prompt on your phone.
That's it — they will add the firewall rule for you automatically.

Thank you!
