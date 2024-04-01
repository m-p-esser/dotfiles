"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findExecutable = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const findExecutable = (program) => {
    if (path_1.default.isAbsolute(program) || program.includes("/") || program.includes("\\")) {
        return program;
    }
    const envPath = process.env.PATH ?? "";
    const envExt = process.env.PATHEXT ?? "";
    const pathDirs = envPath.replace(/["]+/g, "").split(path_1.default.delimiter).filter(Boolean);
    const extensions = envExt.split(";");
    const candidates = pathDirs.flatMap((d) => {
        return extensions.map((ext) => {
            return path_1.default.join(d, program + ext);
        });
    });
    for (const filePath of candidates) {
        if (fs_1.default.existsSync(filePath)) {
            return filePath;
        }
    }
    return "";
};
exports.findExecutable = findExecutable;
//# sourceMappingURL=file-utilities.js.map