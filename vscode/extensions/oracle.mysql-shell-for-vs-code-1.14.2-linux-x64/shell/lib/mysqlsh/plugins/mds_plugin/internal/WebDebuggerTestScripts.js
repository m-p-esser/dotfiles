// Copyright (c) 2021, Oracle and/or its affiliates.

// Get list of OCI Profiles
await ws.send({
    "request_id": ws.generateRequestId(),
    "request": "execute",
    "command": "mds.list.config_profiles",
    "args": {
    }
});

// Get list of compartments
await ws.send({
    "request_id": ws.generateRequestId(),
    "request": "execute",
    "command": "mds.list.compartments",
    "args": {
        "config_profile": "mysqltooling",
    }
});

// Get list of MySQL DB Systems
await ws.send({
    "request_id": ws.generateRequestId(),
    "request": "execute",
    "command": "mds.list.db_systems",
    "args": {
        "config_profile": "mysqltooling",
        "compartment_id": "ocid1.compartment.oc1..aaaaaaaaa2lyxucr2p3bqtqjmolpy2yqljxlft3duw76nk3sw777bdiwtfmq"
    }
});

// Get list of Bastions
await ws.send({
    "request_id": ws.generateRequestId(),
    "request": "execute",
    "command": "mds.list.bastions",
    "args": {
        "config_profile": "mysqltooling",
        "compartment_id": "ocid1.compartment.oc1..aaaaaaaaa2lyxucr2p3bqtqjmolpy2yqljxlft3duw76nk3sw777bdiwtfmq"
    }
});

// Get list of DB System Configs
await ws.send({
    "request_id": ws.generateRequestId(),
    "request": "execute",
    "command": "mds.get.db_system_configuration",
    "args": {
        "config_profile": "mysqltooling",
        "compartment_id": "ocid1.compartment.oc1..aaaaaaaaa2lyxucr2p3bqtqjmolpy2yqljxlft3duw76nk3sw777bdiwtfmq",
        "shape": "VM.Standard.E2.1"
    }
});
