"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogWebviewManager = void 0;
const Requisitions_1 = require("../../../frontend/src/supplement/Requisitions");
const WebviewProvider_1 = require("./WebviewProvider");
class DialogWebviewManager {
    pendingDialogRequests = new Map();
    runningDialogs = new Set();
    url;
    constructor() {
        Requisitions_1.requisitions.register("connectedToUrl", this.connectedToUrl);
        Requisitions_1.requisitions.register("proxyRequest", this.proxyRequest);
    }
    showDialog(request, caption) {
        if (!this.url) {
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            const provider = new WebviewProvider_1.WebviewProvider(this.url, this.handleDispose);
            provider.caption = caption;
            this.pendingDialogRequests.set(provider, resolve);
            void provider.runCommand("showDialog", request, caption);
        });
    }
    handleDispose = (view) => {
        const resolve = this.pendingDialogRequests.get(view);
        if (resolve) {
            resolve();
            this.pendingDialogRequests.delete(view);
        }
        this.runningDialogs.delete(view);
    };
    connectedToUrl = (url) => {
        this.url = url;
        this.pendingDialogRequests.clear();
        return Promise.resolve(true);
    };
    proxyRequest = (request) => {
        switch (request.original.requestType) {
            case "dialogResponse": {
                const response = request.original.parameter;
                const resolve = this.pendingDialogRequests.get(request.provider);
                if (resolve) {
                    request.provider.close();
                    this.pendingDialogRequests.delete(request.provider);
                    resolve(response);
                    return Promise.resolve(true);
                }
                break;
            }
            case "closeInstance": {
                request.provider.close();
                break;
            }
            default:
        }
        return Promise.resolve(false);
    };
}
exports.DialogWebviewManager = DialogWebviewManager;
//# sourceMappingURL=DialogWebviewProvider.js.map