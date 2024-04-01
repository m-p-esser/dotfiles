#!/bin/bash
(
    cd ../../..

    # Executing the GUI Backend Tests has the following requirements
    # - mysqlsh should be in PATH
    # - mysqld should be in PATH
    #
    # To use this script from  NPM Scripts, this requirement needs to be satisfied before opening VSCode
    mysqld_path=`which mysqld`
    result=$?

    if [ "$result" = "1" ]; then
        echo "======== ERROR ========"
        echo "mysqld is not in PATH"
        echo "======================="
        exit 1
    fi

    result=`which mysqlsh`
    if [ "$result" = "1" ]; then
        echo "======= ERROR ========"
        echo "mysqlsh is not in PATH"
        echo "======================"
        exit 1
    fi

    # Required to get the communication log printed in case of errors
    export LOG_LEVEL=DEBUG3

    # If you require to execute a specific test simply add the following
    # command line argument at the end of the command below:
    #
    # -k <filter>
    #
    # i.e:
    # $. mysqlsh --py -f run_tests.py -k new_session.js
    mysqlsh --py -f run_tests.py
)