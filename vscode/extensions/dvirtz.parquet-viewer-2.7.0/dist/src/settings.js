"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonAsArray = exports.backend = exports.loggingSettings = exports.jsonSpace = exports.useParquetTools = exports.setLogLevel = exports.logLevel = exports.setLogFolder = exports.logFolder = exports.setLogPanel = exports.logPanel = exports.setParquetTools = exports.parquetTools = void 0;
const vscode = __importStar(require("vscode"));
const basename = 'parquet-viewer';
function settings() {
    return vscode.workspace.getConfiguration(basename);
}
function parquetTools() {
    return settings().get('parquetToolsPath');
}
exports.parquetTools = parquetTools;
function setParquetTools(parquetTools) {
    return __awaiter(this, void 0, void 0, function* () {
        yield settings().update('parquetToolsPath', parquetTools);
    });
}
exports.setParquetTools = setParquetTools;
function logPanel() {
    return settings().get('logging.panel', settings().get('logPanel', false));
}
exports.logPanel = logPanel;
function setLogPanel(logPanel) {
    return __awaiter(this, void 0, void 0, function* () {
        yield settings().update('logging.panel', logPanel);
    });
}
exports.setLogPanel = setLogPanel;
function logFolder() {
    return settings().get('logging.folder', settings().get('logFolder', ''));
}
exports.logFolder = logFolder;
function setLogFolder(logFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        yield settings().update('logging.folder', logFolder);
    });
}
exports.setLogFolder = setLogFolder;
function logLevel() {
    return settings().get('logging.level', settings().get('logLevel', 'info'));
}
exports.logLevel = logLevel;
function setLogLevel(logLevel) {
    return __awaiter(this, void 0, void 0, function* () {
        yield settings().update('logging.level', logLevel);
    });
}
exports.setLogLevel = setLogLevel;
function useParquetTools() {
    return settings().get('useParquetTools', false);
}
exports.useParquetTools = useParquetTools;
function jsonSpace() {
    return settings().get('json.space', settings().get('jsonSpace'));
}
exports.jsonSpace = jsonSpace;
exports.loggingSettings = ['logging', 'logLevel', 'logPanel', 'logFolder'].map(s => `${basename}.${s}`);
function backend() {
    return useParquetTools() ? 'parquet-tools' : settings().get('backend', 'parquets');
}
exports.backend = backend;
function jsonAsArray() {
    return settings().get('json.asArray', false);
}
exports.jsonAsArray = jsonAsArray;
//# sourceMappingURL=settings.js.map