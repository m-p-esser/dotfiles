// -----------------------------------------------------------------------------
// MySQL REST Service (MRS) module test scripts

// cSpell:ignore sqleditor, sakila, mzinner

// Open SQLEditor session and connect to db_connection_id 1
await ws.send({
    "request": "execute",
    "request_id": ws.generateRequestId(),
    "command": "gui.sqleditor.start_session",
    "args": {}
})

await ws.send({
    "request": "execute",
    "request_id": ws.generateRequestId(),
    "command": "gui.sqleditor.open_connection",
    "args": {
        "db_connection_id": 3,
        "module_session_id": ws.lastModuleSessionId,
    }
})

// Get the MRS status
await ws.send({
    "request_id": ws.generateRequestId(),
    "request": "execute",
    "command": "mrs.status",
    "args": {
        "db_connection_id": 1,
        "module_session_id": ws.lastModuleSessionId,
    }
});

// Configure the MRS metadata schema by either creating or updating it
await ws.send({
    "request_id": ws.generateRequestId(),
    "request": "execute",
    "command": "mrs.configure",
    "args": {
        "db_connection_id": 1,
        "module_session_id": ws.lastModuleSessionId,
    }
});

// Get the list of MRS services
await ws.send({
    "request_id": ws.generateRequestId(),
    "request": "execute",
    "command": "mrs.list.services",
    "args": {
        "module_session_id": ws.lastModuleSessionId,
    }
});

// Get the MRS service schemas
await ws.send({
    "request_id": ws.generateRequestId(),
    "request": "execute",
    "command": "mrs.list.schemas",
    "args": {
        "module_session_id": ws.lastModuleSessionId,
        "service_id": 1,
    }
});

// Get the MRS service schemas
await ws.send({
    "request_id": ws.generateRequestId(),
    "request": "execute",
    "command": "mrs.list.db_objects",
    "args": {
        "module_session_id": ws.lastModuleSessionId,
        "schema_id": 1,
    }
});

// Test the new gui.shell.start_session parameters
ws.tokens["db_connection_id"] = 1;
await ws.send({
    "request": "execute",
    "request_id": ws.generateRequestId(),
    "command": "gui.shell.start_session",
    "args": {
        "db_connection_id": ws.tokens["db_connection_id"],
        "shell_args": ["--", "util", "dump-schemas", "sakila",
            "--outputUrl", '/Users/mzinner/Documents/sakila_dump4']
    }
});

// Test the new gui.shell.start_session parameters
// to configure the MRS Service
ws.tokens["db_connection_id"] = 1;
await ws.send({
    "request": "execute",
    "request_id": ws.generateRequestId(),
    "command": "gui.shell.start_session",
    "args": {
        "db_connection_id": ws.tokens["db_connection_id"],
        "shell_args": ["--", "mrs", "configure"]
    }
});

// Add a MRS Service
ws.tokens["db_connection_id"] = 1;
await ws.send({
    "request": "execute",
    "request_id": ws.generateRequestId(),
    "command": "gui.shell.start_session",
    "args": {
        "db_connection_id": ws.tokens["db_connection_id"],
        "shell_args": ["--", "mrs", "add", "service"]
    }
});