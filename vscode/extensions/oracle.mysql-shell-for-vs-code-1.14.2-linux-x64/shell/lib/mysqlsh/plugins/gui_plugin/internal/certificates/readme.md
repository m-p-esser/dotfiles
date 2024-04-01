### Copyright (c) 2020, 2022, Oracle and/or its affiliates.

# Setting up a certificate for a webserver supporting HTTPS running on localhost

Generate rootCA.key with pass phrase:

```bash
openssl genrsa -des3 -out rootCA.key 2048
```

Generate Root SSL certificate rootCA.pem

```bash
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.pem
```

Trust the root SSL certificate by performing the following steps.

- macOS:
  - opening Keychain Access, go to Category Certificates
  - use File > Import Items to load the rootCA.pem
  - Double click the imported certificate and change the “When using this certificate:” dropdown to Always Trust in the Trust section.

```bash
security add-trusted-cert -d -r trustRoot -k ~/Library/Keychains/login.keychain-db rootCA.pem
```

Create a certificate key for localhost using the configuration settings stored in server.csr.cnf.

```bash
openssl req -new -sha256 -nodes -out server.csr -newkey rsa:2048 -keyout server.key -config <( cat server.csr.cnf )
```

Create a domain certificate for localhost.

```bash
openssl x509 -req -in server.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out server.crt -days 500 -sha256 -extfile v3.ext
```

# Setting up a certificate for a webserver on windows 10
To install root SSL certificate in windows 10, use Microsoft Management Console(MMC)

- Step 1: Click Start > Run
- Step 2: Enter MMC to open Microsoft Management Console.
- Step3: Go to File > Add/Remove Snap-in
- Step 4: Click Certificates, and select Add
- Step 5: Select Computer Account, and click Next
- Step 6: Select Local Computer and click Finish
- Step 7: Click OK to go back to main MMC console window.
- Step 8:Double-click Certificates (local computer) to expand its view.
- Step 9:Right-click Certificates under Trusted Root Certification Authorities and select All Tasks then import
- Step 10:Complete the wizard to import the chain certificate. Browse to locate the chain certificate to be imported or rootCA.pem file to import (plugins\gui\backend\gui\core\certificates)
- Step 11: Select Place all certificates in the following store and select the Trusted Root Certification Authorities store. Click Next; then click Finish to complete the wizard.

Once the "import was successful" then you can locate your installed certificate authority in certificate pane.
