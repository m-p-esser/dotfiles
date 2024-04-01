"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLConnCompression = exports.MySQLSqlMode = exports.MySQLAuthMethod = exports.MySQLSslMode = exports.MySQLConnectionScheme = void 0;
var MySQLConnectionScheme;
(function (MySQLConnectionScheme) {
    MySQLConnectionScheme["MySQL"] = "mysql";
    MySQLConnectionScheme["MySQLx"] = "mysqlx";
})(MySQLConnectionScheme = exports.MySQLConnectionScheme || (exports.MySQLConnectionScheme = {}));
var MySQLSslMode;
(function (MySQLSslMode) {
    MySQLSslMode["Disabled"] = "DISABLED";
    MySQLSslMode["Preferred"] = "PREFERRED";
    MySQLSslMode["Required"] = "REQUIRED";
    MySQLSslMode["VerifyCA"] = "VERIFY_CA";
    MySQLSslMode["VerifyIdentity"] = "VERIFY_IDENTITY";
})(MySQLSslMode = exports.MySQLSslMode || (exports.MySQLSslMode = {}));
var MySQLAuthMethod;
(function (MySQLAuthMethod) {
    MySQLAuthMethod["Auto"] = "AUTO";
    MySQLAuthMethod["FromCapabilities"] = "FROM_CAPABILITIES";
    MySQLAuthMethod["Fallback"] = "FALLBACK";
    MySQLAuthMethod["MySQL41"] = "MYSQL41";
    MySQLAuthMethod["Plain"] = "PLAIN";
    MySQLAuthMethod["SHA256"] = "SHA256_MEMORY";
})(MySQLAuthMethod = exports.MySQLAuthMethod || (exports.MySQLAuthMethod = {}));
var MySQLSqlMode;
(function (MySQLSqlMode) {
    MySQLSqlMode["Ansi"] = "ANSI";
    MySQLSqlMode["Traditional"] = "TRADITIONAL";
    MySQLSqlMode["AllowInvalidDates"] = "ALLOW_INVALID_DATES";
    MySQLSqlMode["AnsiQuotes"] = "ANSI_QUOTES";
    MySQLSqlMode["ErrorForDivisionByZero"] = "ERROR_FOR_DIVISION_BY_ZERO";
    MySQLSqlMode["HighNotPrecedence"] = "HIGH_NOT_PRECEDENCE";
    MySQLSqlMode["IgnoreSpace"] = "IGNORE_SPACE";
    MySQLSqlMode["NoAutoValueOnZero"] = "NO_AUTO_VALUE_ON_ZERO";
    MySQLSqlMode["NoUnsignedSubtraction"] = "NO_UNSIGNED_SUBTRACTION";
    MySQLSqlMode["NoZeroDate"] = "NO_ZERO_DATE";
    MySQLSqlMode["NoZeroInDate"] = "NO_ZERO_IN_DATE";
    MySQLSqlMode["OnlyFullGroupBy"] = "ONLY_FULL_GROUP_BY";
    MySQLSqlMode["PadCharToFullLength"] = "PAD_CHAR_TO_FULL_LENGTH";
    MySQLSqlMode["PipesAsConcat"] = "PIPES_AS_CONCAT";
    MySQLSqlMode["RealAsFloat"] = "REAL_AS_FLOAT";
    MySQLSqlMode["StrictAllTables"] = "STRICT_ALL_TABLES";
    MySQLSqlMode["StrictTransTables"] = "STRICT_TRANS_TABLES";
    MySQLSqlMode["TimeTruncateFractional"] = "TIME_TRUNCATE_FRACTIONAL";
})(MySQLSqlMode = exports.MySQLSqlMode || (exports.MySQLSqlMode = {}));
var MySQLConnCompression;
(function (MySQLConnCompression) {
    MySQLConnCompression["Required"] = "REQUIRED";
    MySQLConnCompression["Preferred"] = "PREFERRED";
    MySQLConnCompression["Disabled"] = "DISABLED";
})(MySQLConnCompression = exports.MySQLConnCompression || (exports.MySQLConnCompression = {}));
//# sourceMappingURL=MySQL.js.map