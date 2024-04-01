"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitTextToLines = exports.formatTextBlock = exports.compareVersionStrings = exports.convertSnakeToCamelCase = exports.convertCamelToSnakeCase = exports.basename = exports.pathToCamelCase = exports.convertToPascalCase = exports.convertTitleToCamelCase = exports.convertCamelToTitleCase = exports.camelToSnakeCase = exports.snakeToCamelCase = exports.filterInt = exports.convertHexToBase64 = exports.formatBase64ToHex = exports.formatWithNumber = exports.formatBytes = exports.formatTime = exports.isWhitespaceOnly = exports.convertPropValue = exports.unquote = exports.quote = void 0;
const buffer_1 = require("buffer");
const helpers_1 = require("./helpers");
const quotePairs = new Map([
    ["(", ")"],
    ["{", "}"],
    ["[", "]"],
    ["\"", "\""],
    ["'", "'"],
    ["`", "`"],
]);
const quote = (text, quoteChar = "`") => {
    const second = quotePairs.get(quoteChar) ?? quoteChar;
    if (text.length > 2) {
        const first = text[0];
        const last = text[text.length - 1];
        if (quoteChar === first && second === last) {
            return text;
        }
    }
    return `${quoteChar}${text}${second}`;
};
exports.quote = quote;
const unquote = (text, quotes = "\"'`") => {
    let result = text.trim();
    if (result.length > 1) {
        const first = result[0];
        const last = result[result.length - 1];
        if (quotes.includes(first)) {
            const second = quotePairs.get(first);
            if (second === last) {
                result = result.substring(1, result.length - 1);
            }
        }
    }
    return result;
};
exports.unquote = unquote;
const convertPropValue = (value, numericUnit = "px") => {
    if (value == null) {
        return undefined;
    }
    if (typeof value === "number") {
        return `${value}${numericUnit}`;
    }
    return value;
};
exports.convertPropValue = convertPropValue;
const isWhitespaceOnly = (str) => {
    return /^\s+$/.test(str);
};
exports.isWhitespaceOnly = isWhitespaceOnly;
const formatTime = (time) => {
    if (time === undefined || time === null || isNaN(time) || !isFinite(time) || time < 0) {
        return "invalid time";
    }
    if (time < 10) {
        if (time < 1) {
            if (time === 0) {
                return "0s";
            }
            return `${Math.floor(time * 1e6) / 1000}ms`;
        }
        const seconds = Math.floor(time);
        if (time - seconds > 0) {
            return `${time}s`;
        }
        return `${seconds}s`;
    }
    else {
        time = Math.round(time);
        const days = Math.floor(time / 86400);
        const hours = Math.floor(time / 3600) % 24;
        const minutes = Math.floor(time / 60) % 60;
        const seconds = time % 60;
        return (days > 0 ? (`0${days}`).slice(-2) + "d " : "") +
            (hours > 0 ? (`0${hours}`).slice(-2) + ":" : "") +
            (minutes > 0 ? (`0${minutes}`).slice(-2) + ":" : "") +
            (time > 60 ? (`0${seconds}`).slice(-2) : `${seconds}s`);
    }
};
exports.formatTime = formatTime;
const formatBytes = (value) => {
    if (value < 1024) {
        return `${value.toFixed(2)} B`;
    }
    value /= 1024;
    if (value < 1014) {
        return `${value.toFixed(2)} KB`;
    }
    value /= 1024;
    if (value < 1024) {
        return `${value.toFixed(2)} MB`;
    }
    value /= 1024;
    return `${value.toFixed(2)} GB`;
};
exports.formatBytes = formatBytes;
const formatWithNumber = (text, value) => {
    return `${value} ${text}${(value === 1 || value === -1) ? "" : "s"}`;
};
exports.formatWithNumber = formatWithNumber;
const formatBase64ToHex = (input, limit) => {
    if (typeof input !== "string") {
        return "<invalid>";
    }
    const buffer = buffer_1.Buffer.from(input, "base64");
    const bufString = buffer.toString("hex");
    if (limit && bufString.length > limit) {
        return "0x" + bufString.substring(0, limit) + "…";
    }
    return "0x" + bufString;
};
exports.formatBase64ToHex = formatBase64ToHex;
const convertHexToBase64 = (hex) => {
    if (hex.startsWith("0x")) {
        hex = hex.slice(2);
    }
    const buffer = buffer_1.Buffer.from(hex, "hex");
    const bufString = buffer.toString("base64");
    return bufString;
};
exports.convertHexToBase64 = convertHexToBase64;
const filterInt = (value) => {
    if (/^[-+]?(\d+|Infinity)$/.test(value)) {
        return Number(value);
    }
    else {
        return NaN;
    }
};
exports.filterInt = filterInt;
const snakeToCamelCase = (str) => {
    if (str.includes("_") || str.includes("-")) {
        return str.toLowerCase().replace(/([-_][a-z])/g, (group) => {
            return group
                .toUpperCase()
                .replace("-", "")
                .replace("_", "");
        });
    }
    else {
        return str;
    }
};
exports.snakeToCamelCase = snakeToCamelCase;
const camelToSnakeCase = (str) => {
    return str.replace(/([a-z])([A-Z])/g, (full, match1, match2) => {
        return `${match1}_${match2.toLowerCase()}`;
    });
};
exports.camelToSnakeCase = camelToSnakeCase;
const convertCamelToTitleCase = (s) => {
    if (s.length < 1) {
        return "";
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
};
exports.convertCamelToTitleCase = convertCamelToTitleCase;
const convertTitleToCamelCase = (s) => {
    if (s.length < 1) {
        return "";
    }
    return s.charAt(0).toLowerCase() + s.slice(1);
};
exports.convertTitleToCamelCase = convertTitleToCamelCase;
const convertToPascalCase = (str) => {
    str = str.replace(/[^\d\w,]/g, "");
    if (str.includes("_")) {
        str = (0, exports.snakeToCamelCase)(str);
    }
    return (0, exports.convertCamelToTitleCase)(str);
};
exports.convertToPascalCase = convertToPascalCase;
const pathToCamelCase = (str) => {
    if (str.startsWith("/")) {
        str = str.slice(1);
    }
    str.replaceAll("/", "_");
    return str.replace(/([-_][a-z])/g, (group) => {
        return group
            .toUpperCase()
            .replace("-", "")
            .replace("_", "");
    });
};
exports.pathToCamelCase = pathToCamelCase;
const basename = (path, extension) => {
    const result = path.split(/[\\/]/).pop() ?? "";
    if (extension && result.endsWith(extension)) {
        return result.substring(0, result.length - extension.length);
    }
    return result;
};
exports.basename = basename;
const convertCamelToSnakeCase = (o, options) => {
    return (0, helpers_1.deepMapKeys)(o, options?.ignore ?? [], (value, key) => {
        const snakeCased = key.replace(/([a-z])([A-Z])/g, (full, match1, match2) => {
            return `${match1}_${match2.toLowerCase()}`;
        });
        return snakeCased;
    });
};
exports.convertCamelToSnakeCase = convertCamelToSnakeCase;
const convertSnakeToCamelCase = (o, options) => {
    return (0, helpers_1.deepMapKeys)(o, options?.ignore ?? [], (value, key) => {
        return key.replace(/_([a-z0-9])/gi, (full, match) => {
            return match.toUpperCase();
        });
    });
};
exports.convertSnakeToCamelCase = convertSnakeToCamelCase;
const compareVersionStrings = (baseVersion, compareToVersion) => {
    const v1 = baseVersion.split(".");
    const v2 = compareToVersion.split(".");
    const k = Math.min(v1.length, v2.length);
    for (let i = 0; i < k; ++i) {
        const v1Num = parseInt(v1[i], 10);
        const v2Num = parseInt(v2[i], 10);
        if (v1Num > v2Num) {
            return 1;
        }
        if (v1Num < v2Num) {
            return -1;
        }
    }
    return v1.length === v2.length ? 0 : (v1.length < v2.length ? -1 : 1);
};
exports.compareVersionStrings = compareVersionStrings;
const formatTextBlock = (text, maxLineLength) => {
    return text.match(new RegExp(String.raw `\S(?:.{0,${maxLineLength - 2}}\S)?(?= |$)`, "g"))?.join("\n") ?? "";
};
exports.formatTextBlock = formatTextBlock;
const splitTextToLines = (text) => {
    const lines = [];
    let head = 0;
    let run = 0;
    while (run < text.length) {
        switch (text[run]) {
            case "'":
            case "`":
            case "\"": {
                const delimiter = text[run];
                while (run < text.length) {
                    if (text[run] === "\\") {
                        ++run;
                    }
                    else if (text[run] === delimiter) {
                        ++run;
                        break;
                    }
                    ++run;
                }
                break;
            }
            case "\n": {
                lines.push(text.slice(head, ++run));
                head = run;
                break;
            }
            case "/": {
                if (run + 1 < text.length && text[run + 1] === "*") {
                    run += 2;
                    while (run < text.length) {
                        if (text[run++] === "*") {
                            if (run < text.length && text[run] === "/") {
                                ++run;
                                break;
                            }
                        }
                    }
                }
                else {
                    ++run;
                }
                break;
            }
            default: {
                ++run;
                break;
            }
        }
    }
    return lines;
};
exports.splitTextToLines = splitTextToLines;
//# sourceMappingURL=string-helpers.js.map