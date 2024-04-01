# Snowflake

This extension enables you to connect to Snowflake, write and execute sql queries, and view results without leaving VS Code.

## Features

- [Snowflake SQL Intellisense](#intellisense)

  - Autocompletion for object names, keywords, and built-in functions
  - Signature help for built-in functions
  - Documentation for keywords and built-in functions on hover

- [Accounts & Sessions](#accounts--sessions)

  - Connect to and quickly switch between multiple Snowflake accounts
  - View and set role, database, schema, and warehouse for the active session
  - Enable secondary roles for the active session

- [Object Explorer](#object-explorer)

  - View detailed information on items within the explorer, grouped by database kind.
  - Copy the object name to your clipboard for use in query authoring

- [Stage Operations](#stage-operations)

  - LIST stage contents
  - GET files from a stage
  - PUT files and folders to an internal stage

- [Query Execution](#query-execution)

  - Execute single or multi-statement queries

- [Query Results & History](#query-results--history)
  - View and sort query results
  - Export query results to a CSV file
  - View history of executed queries and their results
  - Copy previously executed queries

## Intellisense

This extension provides autocomplete support for database object names, built-in functions, and Snowflake SQL keywords. Database, schema, and table name suggestions will show up as you type your query.

![Typeahead suggestion](https://app.snowflake.com/static/vscode-extension-readme/intellisense.png?v=11)

Keywords and object names display first in the list, followed by built-in functions.

![Function signature typeahead](https://app.snowflake.com/static/vscode-extension-readme/signature-help.png?v=11)

Function parameters will be highlighted as you type, and a link to the function documentation is available in the info panel.

![View object details](https://app.snowflake.com/static/vscode-extension-readme/object-details.png?v=11)

With your cursor inside an identifier, right click and select `Snowflake: View Object Details` to view details for that object.

## Accounts & Sessions

<img src="https://app.snowflake.com/static/vscode-extension-readme/sign-in.png?v=11" width="340" alt="Sign In"/>
<img src="https://app.snowflake.com/static/vscode-extension-readme/execution-context.png?v=11" width="340" alt="Execution Context"/>

Located in the [Activity Bar](https://code.visualstudio.com/api/ux-guidelines/activity-bar), the Account view lets you authenticate to Snowflake and switch between multiple accounts.

Once logged in, you'll be able to see and change your active database, schema, role, and warehouse.

## Object Explorer

<img src="https://app.snowflake.com/static/vscode-extension-readme/object-explorer.png?v=11" width="340" alt="Object Explorer"/>

Located in the [Activity Bar](https://code.visualstudio.com/api/ux-guidelines/activity-bar), the Object Explorer provides a hierarchical view of your database and application objects:

- Schemas
- Tables
- Views
- Stages
- Pipes
- Streams
- Tasks
- Functions
- Procedures

You can copy the object name to your clipboard by clicking the inline action icon on the right of the highlighted line.
Clicking on an object will open up the object details view in the [Panel](https://code.visualstudio.com/api/ux-guidelines/panel), displaying additional information for each object.

## Stage Operations

![Stage Operations](https://app.snowflake.com/static/vscode-extension-readme/stage-operations.png?v=11)

When you expand a stage within the Object Explorer, you will be able to LIST all the files contained within that stage. To GET files, use the available download buttons to download an entire stage, a directory, or a single file. If you are interacting with an internal stage, you can also use the upload button to PUT a single file, multiple files, or an entire directory into the stage.

## Query Execution

![Query Execution](https://app.snowflake.com/static/vscode-extension-readme/query-execution.png?v=11)

You can use the inline "Execute" links to execute a given statement.

To execute multiple queries, select the ones you want to run and press CMD/CTRL+Enter. You can also use the "Execute All Statements" button in the upper right corner of the editor window to run all queries in the current file.

Query results will be displayed in the [Panel](https://code.visualstudio.com/api/ux-guidelines/panel).

## Query Results

![Query Results](https://app.snowflake.com/static/vscode-extension-readme/query-results.png?v=11)

When you click on a cell in the results table, the content of that cell will be displayed to the right. If you wish to select multiple cells or entire columns, you can use SHIFT or CMD/CTRL. Additionally, you can select all columns and rows by using the checkbox located in the upper-left corner of the results grid.

Located in the upper-right corner, there are three buttons:

- The info icon can be used to toggle the visibility of the query and cell details sidebar.
- The save icon can be used to save the local results.
- The download icon can be used to download the full result to disk as a CSV, provided that the results are still cached. For persisted query results of all sizes, the cache expires after 24 hours.

Dragging a column header allows you to rearrange the column order. Right-clicking on a column header will allow you to sort, hide, or freeze that column.

## Query History

<img src="https://app.snowflake.com/static/vscode-extension-readme/query-history.png?v=11" width="340" alt="Query History"/>

View previous queries executed in the Query History view, located in the [Activity Bar](https://code.visualstudio.com/api/ux-guidelines/activity-bar). Clicking on a query will bring up its results in the query results view.

Hovering over an item in the Query History view will allow you to copy the query or remove it from your local history.

To clear all queries from history, click the icon in the top right of the Query History title bar.
