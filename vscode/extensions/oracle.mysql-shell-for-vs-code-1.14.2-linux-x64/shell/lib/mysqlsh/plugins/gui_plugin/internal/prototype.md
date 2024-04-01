# Copyright (c) 2020, 2021, Oracle and/or its affiliates.

# MySQL Shell GUI Prototype

This git repo contains the MySQL Shell GUI Prototype code.

## Prerequisites

- Please ensure to have the MySQL Shell installed. It can be downloaded from <https://dev.mysql.com/downloads/shell/>
- Run the shell at least once so it creates the ~/.mysqlsh directory

## Cloning the repository

```bash
git clone ssh://<user>@jacquingasse.myds.me/volume1/Git/mysqlsh.prototype
```

## Steps after cloning the repository

After cloning this repo, add a symlink from the ~/git/mysqlsh.prototype/gui_plugin folder to ~/.mysqlsh/plugins/gui_plugin

This example assumes the repo was cloned in the ~/git folder on macOS or Linux.

```bash
ln -s ~/git/mysqlsh.prototype/gui_plugin ~/.mysqlsh/plugins/gui_plugin
```

This example is for Windows, to be executed in an elevated PowerShell.

```PowerShell
New-Item -ItemType SymbolicLink -Path "C:\Users\<user>\git\mysqlsh.prototype\gui_plugin" -Target "C:\Users\<user>\AppData\Roaming\MySQL\mysqlsh\plugins\gui_plugin"
```

Run the MySQL Shell to create a first GUI user account.

```bash
mysqlsh --py -e "print(gui.users.create_user('evi', '1234', 'Administrator'))"
```

## Debugging the MySQL Shell GUI Prototype with VSCode

After opening the cloned folder with VSCode there is a debug configuration available to start the mock webserver.

The .env file ensures that the PYTHON path is set to the plugins folder so the debug session can be started right away.

If an import error is printed on first run, start the debug session a second time.

## Let the MySQL Shell run the GUI webserver

The following command will start the GUI webserver on port 8001.

```bash
mysqlsh --py -e "gui.core.start_web_server(8001)"
```

## Installing the certificate for localhost

In order for browsers to not complain about an unsecure https connection, the certificate used by the mock webserver needs to be added to the local keychain. The repository includes a set of certificate files that can be used for testing purposes. For production usage, a new set of certificates need to be created.

- macOS:
  - opening Keychain Access, go to Category Certificates
  - use File > Import Items to load the rootCA.pem from the plugins/gui_plugin/core/certificates/
  - Double click the imported certificate and change the “When using this certificate:” dropdown to Always Trust in the Trust section.

## Running the MySQL Shell GUI in a brower

After the webserver has started successfully, use a browser to open the URL <https://localhost:8000/> when started on port 8000 or <http://localhost:8001/> when starting on port 8001.
