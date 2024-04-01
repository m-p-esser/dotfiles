"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeMessageScheduler = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const ws_1 = __importDefault(require("ws"));
const MessageScheduler_1 = require("../../../frontend/src/communication/MessageScheduler");
class NodeMessageScheduler extends MessageScheduler_1.MessageScheduler {
    static createInstance() {
        return new NodeMessageScheduler();
    }
    createWebSocket(target, options) {
        let ca;
        if (options.shellConfigDir) {
            const caFile = (0, path_1.join)(options.shellConfigDir, "plugin_data/gui_plugin/web_certs/rootCA.crt");
            if ((0, fs_1.existsSync)(caFile)) {
                ca = (0, fs_1.readFileSync)(caFile);
            }
        }
        return new ws_1.default(target, { ca });
    }
}
exports.NodeMessageScheduler = NodeMessageScheduler;
//# sourceMappingURL=NodeMessageScheduler.js.map