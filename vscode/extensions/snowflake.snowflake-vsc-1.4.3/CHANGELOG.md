# Change Log

## v1.4.3

### Bug Fixes

- Fixed an issue that caused queries to stall when results included floating-point values within variant columns

## v1.4.2

### Bug Fixes

- Improved autocomplete suggestions for dynamic tables
- Fixed an issue with incorrect large integer values inside variant column results

## v1.4.1

### Bug Fixes

- Fixed searchable object explorer commands for functions and procedures.

## v1.4.0

### Features

- The Object Explorer is now searchable
- Use --#region and --#endregion or //#region and //#endregion markers to indicate blocks for code folding
- Improved object detail information for application packages

## v1.3.0

### Bug Fixes

- Fixed an issue getting DDL for double-quoted case-sensitive databases and schemas
- Fixed a parsing issue with a specific statement order containing multiple ending semicolons
- Fixed a parsing issue when the keywords WORK and TRANSACTION are used as identifiers

### Features

- Added support for login using key-pair authentication (RSA key)

## v1.2.2

### Bug Fixes

- The Database quick picker is operational again.
- New command added: "Execute Statements in Parallel". Trigger it via the command palette to concurrently execute statements in the active editor window.

## v1.2.1

### Bug Fixes

- Fixed an issue where autocompletion for database-like objects in SQL documents would fail.
- Fixed two statement parsing bugs.

## v1.2.0

### Bug Fixes

- Fixed an issue preventing schema objects from being introspected.
- Fixed an issue where uploads could fail silently; errors are now shown to the user.
- Fixed an issue where the "Show SQL" button could silently fail; underlying errors are now shown to the user in the newly-opened editor.
- Fixed an issue where autocompleting in SQL documents would fail when not connected to Snowflake.

### Features

- Overwrite now defaults to true when uploading files to stages.
- Users are now warned when they are using overwrite mode on upload; this warning can be disabled via the `snowflake.skipOverwriteWarning` configuration option.
- Database Explorer is now Object Explorer, showing not only Databases but Applications and Application Packages as well.
- When introspecting application objects, we now show application-specific information by running `desc application` instead of `desc database`.

## v1.1.3

### Bug Fixes

- Clearing query history will now only clear the history of the active account.

## v1.1.2

### Features

- Autocomplete of keys in variant type columns is now supported.
- Added configuration to disable variant key autocomplete.

## v1.1.1

### Bug Fixes

- Fixed issue causing an errant "No view is registered with id" error message.
- Fixed a statement parsing bug.

## v1.1.0

### Bug Fixes

- Fixed an issue causing IntelliSense to not work properly in files with CRLF line endings.
- Fixed several issues around displaying results with duplicate column names
- Object Explorer now properly lists objects if you have more than 10k of a specific type
- Downloading results is now faster
- Fixed several statement parsing bugs.

### Features

- Query Results can now be opened in an editor pane, allowing you to compare multiple result sets side by side
- Added configuration to disable session keep alive
- Result columns are now sized based on their content

## v1.0.0

- GA

## v0.8.3

### Bug Fixes

- Fixed sorting of numeric columns.
- The Database Explorer will now correctly display the children of lowercased quoted identifiers.

## v0.8.2

### Bug Fixes

- Fixed a regression causing the Snowflake SQL Language server to become unresponsive when handling files with CRLF line endings.

## v0.8.1

### Bug Fixes

- Fixed a result parsing bug causing some queries to hang.
- Hovering over tokens in Snowflake SQL files will no longer error.

## v0.8.0

### Features

- When autocompleting Snowflake objects, their details are no longer displayed by default. To turn this feature back on, set the `snowflake.autocompleteObjectDetails.enabled` configuration value to true.
- Improved formatting of Query History tooltips.
- A configuration option has been added to restrict the number of entries in Query History.

### Bug Fixes

- When cancelling a query, its status is now properly updated.
- Error messages for queries can now be scrolled if they are too long, and their formatting is preserved.
- Several issues related to resizing query columns have been fixed.
- You can now PUT files to temporary internal stages from the Database Explorer.
- Autocomplete suggestions for keywords and built-in functions now preserve case.
- Fixed several statement parsing bugs.
- Fixed syntax highlighting of line comments beginning with "//".

## v0.7.1

### Bug Fixes

- Revived the sidebar displaying active cell contents
- Copying JSON values no longer wraps them in quotes

## v0.7.0

### Features

- Results viewer has been revamped, with added support for:
  - Reordering columns
  - Freezing columns
  - Hiding columns
  - Copy/pasting entire rows/columns
  - Copy/pasting the entire result set
  - Search function (via CMD/CTRL + F)
  - Keyboard navigation
- Added configuration option to disable background highlighting of current statement.
- Added support for loading connection configuration from SnowSQL config files.
- Execution context is now persisted across sessions.
- Added support for viewing DDL for objects.
- Warehouse selector now displays the size of each warehouse.
- Tables and views now support Data Preview.
- Dynamic Tables will now show up in the Object Explorer.
- Added CSV configuration options.

### Bug Fixes

- Saving files now defaults to Downloads directory and remembers the last selected directory.
- Query details are now displayed for failed queries.

## v0.6.3

### Features

- Databases and Schemas now have a button to "View Object Details" in the Object Explorer
- Added a button to manually refresh the Object Explorer

### Bug Fixes

- Query ID is no longer cut off in the Results pane and can be copied.
- Resolved PUT/GET errors for Azure accounts
- Fixed issues with cancelling pending queries
- Added support for results containing columns with duplicate names
- Addressed a parsing problem impacting large queries
- Fixed a handful of syntax highlighting issues

## v0.6.2

### Features

- Double & single quotes now auto-close.
- [Autosurrounding](https://code.visualstudio.com/api/language-extensions/language-configuration-guide#autosurrounding) config added for the following characters: `` { [ ( ' " `  ``

### Bug Fixes

- Fixed an issue causing 100% CPU usage for some users while migrating results from an old to new format
- NULL cells now correctly display as NULL instead of empty

## v0.6.1

### Features

- Binary results are now displayed as hex values

### Bug Fixes

- Fixed an issue where the query history gets stuck in a loop when multiple statements are executed in rapid succession.
- Improved performance by optimizing how we persist query results.
- Fixed several statement boundary parsing related issues

## v0.6.0

### Features

- Added support for stage operations to the Database Explorer

  - Stages can now be expanded to list their contents
  - New inline action for stages to PUT files and folders (preserving paths)
  - New inline action for stages and stage children to GET files (preserving paths)
  - New inline action to remove files from stages

- Managing session context is now easier
  - Active role, database, schema and warehouse can now be updated from the [Status Bar](https://code.visualstudio.com/api/ux-guidelines/status-bar)
  - Use VS Code's built in UI to better accomodate long names and support typeahead

### Bug Fixes

- Database explorer no longer breaks if objects of different types have the same name
- Fixed several parsing issues for statements that contained Snowflake Scripting blocks

## v0.5.5

### Features

- Allow copy-pasting of visible query results

### Bug Fixes

- Update execution context after creating a new object which switches to the object
- Don't show query history when executing queries if it's hidden

## v0.5.4

### Bug Fixes

- Fix issue with statement parsing on documents using CRLF as end of line sequence
- Fix issue with Snowflake Scripting statements using if conditions
- Add right click to copy cell contents in object details view

## v0.5.3

### Bug Fixes

- Made Intellisense and statement parsing more robust
- Fixed a parsing issue with statements that contain a single quote inside double quotes
- Role selector no longer breaks if a role contains special characters
- SAML authentication should now be more reliable

### Internals

- Use pnpm instead of yarn

## v0.5.2

### Bug Fixes

- Using a URL to add an account show now work as expected
- Query durations are now displayed in more human-friendly units
- Improved support for regionless account identifiers
- Execution errors will now properly show up in the results view

### Internals

- Ensure changelog is included in the VSIX file
- Prefixed viewIds with "snowflake" to avoid conflicts with other extensions

## v0.5.1

### Features

- Added a button to the Database Explorer title bar to create a new Snowflake SQL file.
- Added a button to the Account view title bar to open the getting started guide.
- Added a button to the editor title bar which will execute all statements in the current file

### Bug Fixes

- Fixed an issue with repeated error messages after signing out

- **Query Results**

  - Selecting an area outside of the table or details pane will now unselect a cell
  - Pretty-print JSON when copying/displaying cell values
  - Fixed issue with results not updating after a query has finished executing

- **Intellisense**
  - Fixed issue with highlighting statements in non .sql files
  - Fixed issue with missing keywords in autocomplete suggestions
  - Function parameters are no longer included in the list view of autocomplete suggestions
  - Executing current statement should now behave more predictably

### Internals

- Files with a .snowsql extension will no longer work, use .sql instead
- Logs are now quieter
- Added license file
- Updated readme

## v0.4.9

### Features

- Add support for authenticated proxies
- Add X button to close cell details panel

### Bug Fixes

- Fix sort error when user switches query after sorting

### Internals

- Use a dedicated secondary grammar for statement boundary detection

## v0.4.7

### Features

- Re-run query from query history
- Cancel pending query without removing it

### Bug Fixes

- Fix incorrect rounding of sql hashes and other large numbers
- Clear sort when user changes query
- Add Snowflake Scripting support
- Fix grammar for execute immediate, explain

### Internals

- Added migration support
- Telemetry cleanup

## v0.4.6

### Features

- Added function signature autocomplete support
- Added ability to copy results table cell content from right-click context menu
- Added a success/failure icon for each query to the query history view
- Show a message that the query produced no results if 0 rows were returned
- Show query id in query details view
- Added a Show Change Log command to Command Palette

### Bug Fixes

- Highlight current statement more consistently, even if statement is invalid
- Fixed embedded Python code whitespace removal bug

### Internals

- Moved statement handling logic into language server
- Allow proxied broadcasts to be subscribed and triggered on both the webview and extension sides of app
- Added query history migration support to assist with compatibility across query history versions
- Queries now have a client id (cid) and a Snowflake query id field. This breaks version compatibility for query history

## v0.4.5

- Autocomplete support for dbs, tables, views, columns, roles and warehouses
- View object details at cursor (right click or alt + . )
- Add configuration support for turning off codelens (execute links)
- Add command to restart the language server
- Hovering over a keyword or built-in function will show a tooltip with help text and a link to docs
- Improved loading perf of database explorer and execution context dropdowns
- USE schema.db will now properly refresh the execution context
- Object cache is invalidated after create|alter|drop|replace statements

## v0.4.4

- Multi-statement execution
- Show cell view in right pane when user clicks cell

## v0.4.2

- Fix SET/UPDATE/DELETE/CALL statement parsing

## v0.4.1

- Various statement execution bug fixes

## v0.3.0

- Private Preview
