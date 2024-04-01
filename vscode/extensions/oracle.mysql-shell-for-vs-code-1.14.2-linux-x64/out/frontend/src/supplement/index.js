"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertRows = exports.generateColumnInfo = exports.Stack = exports.isEditorLanguageSuffix = exports.editorLanguageSuffixes = exports.isEditorLanguage = exports.editorLanguages = void 0;
const RdbmsInfo_1 = require("../app-logic/RdbmsInfo");
const Types_1 = require("../app-logic/Types");
const ShellInterface_1 = require("./ShellInterface");
exports.editorLanguages = [
    "text", "typescript", "javascript", "mysql", "sql", "python", "json", "markdown", "msg", "xml", "ini"
];
const isEditorLanguage = (value) => {
    return typeof value === "string" && exports.editorLanguages.includes(value);
};
exports.isEditorLanguage = isEditorLanguage;
exports.editorLanguageSuffixes = [
    "txt", "ts", "js", "mysql", "sql", "py", "json", "md", "msg", "xml", "ini"
];
const isEditorLanguageSuffix = (value) => {
    return typeof value === "string" && exports.editorLanguageSuffixes.includes(value);
};
exports.isEditorLanguageSuffix = isEditorLanguageSuffix;
var Stack_1 = require("./Stack");
Object.defineProperty(exports, "Stack", { enumerable: true, get: function () { return Stack_1.Stack; } });
const generateColumnInfo = (dbType, rawColumns, useName) => {
    if (!rawColumns) {
        return [];
    }
    const dataTypes = dbType === ShellInterface_1.DBType.MySQL ? RdbmsInfo_1.mysqlInfo.dataTypes : RdbmsInfo_1.sqliteInfo.dataTypes;
    return rawColumns.map((entry, index) => {
        let type;
        if (entry.type.toLowerCase() === "bytes") {
            if (entry.length < 256) {
                type = Types_1.DBDataType.Binary;
            }
            else {
                type = Types_1.DBDataType.Blob;
            }
        }
        else {
            const foundType = dataTypes.get(entry.type.toLowerCase());
            type = foundType ? foundType.type : Types_1.DBDataType.Unknown;
        }
        return {
            title: entry.name,
            field: useName ? entry.name : String(index),
            dataType: {
                type,
            },
        };
    });
};
exports.generateColumnInfo = generateColumnInfo;
const convertRows = (columns, rows) => {
    if (!rows || rows.length === 0) {
        return [];
    }
    if (Array.isArray(rows[0])) {
        const convertedRows = [];
        rows.forEach((value) => {
            const row = {};
            const entry = value;
            columns.forEach((column, columnIndex) => {
                row[column.field] = entry[columnIndex];
            });
            convertedRows.push(row);
        });
        return convertedRows;
    }
    return rows;
};
exports.convertRows = convertRows;
//# sourceMappingURL=index.js.map