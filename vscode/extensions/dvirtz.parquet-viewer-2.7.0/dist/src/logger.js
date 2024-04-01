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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initLogger = exports.getLogger = void 0;
/**
 * This file manages the logger's state.
 */
const vscode_1 = require("vscode");
const wrapper_1 = require("@vscode-logging/wrapper");
const settings_1 = require("./settings");
const logger_1 = require("@vscode-logging/logger");
const meta = __importStar(require("../package.json"));
// On file load we initialize our logger to `NOOP_LOGGER`
// this is done because the "real" logger cannot be initialized during file load.
// only once the `activate` function has been called in extension.ts
// as the `ExtensionContext` argument to `activate` contains the required `logPath`
let loggerImpel = wrapper_1.NOOP_LOGGER;
let loggerPanel = undefined;
function getLogger() {
    return loggerImpel;
}
exports.getLogger = getLogger;
function setLogger(newLogger) {
    loggerImpel = newLogger;
}
function getPanel(name) {
    if (!loggerPanel) {
        loggerPanel = vscode_1.window.createOutputChannel(name);
    }
    return loggerPanel;
}
function initLogger(context) {
    setLogger((0, logger_1.getExtensionLogger)({
        extName: meta.name,
        level: (0, settings_1.logLevel)(),
        logPath: (0, settings_1.logFolder)() || (context === null || context === void 0 ? void 0 : context.logUri.fsPath),
        logOutputChannel: (0, settings_1.logPanel)() ? getPanel(meta.displayName) : undefined,
        logConsole: context == undefined
    }));
}
exports.initLogger = initLogger;
//# sourceMappingURL=logger.js.map