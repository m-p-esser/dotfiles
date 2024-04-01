"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requisitions = exports.RequisitionHub = exports.appParameters = void 0;
const RequisitionPipeline_1 = require("./RequisitionPipeline");
exports.appParameters = new Map();
const parseAppParameters = () => {
    if (typeof window !== "undefined") {
        const queryParts = window.location.search.substring(1).split("&");
        queryParts.forEach((part) => {
            const elements = part.split("=");
            if (elements.length > 1) {
                exports.appParameters.set(elements[0], elements[1]);
                if (elements[0] === "app") {
                    exports.appParameters.embedded = true;
                }
                else if (elements[0] === "fontSize") {
                    const fontSize = parseInt(elements[1], 10);
                    if (!isNaN(fontSize)) {
                        exports.appParameters.fontSize = fontSize;
                    }
                }
                else if (elements[0] === "editorFontSize") {
                    const fontSize = parseInt(elements[1], 10);
                    if (!isNaN(fontSize)) {
                        exports.appParameters.editorFontSize = fontSize;
                    }
                }
            }
        });
    }
    if (process.env.NODE_ENV === "test") {
        exports.appParameters.testsRunning = true;
    }
    else if (process.env.NODE_ENV === "development") {
        exports.appParameters.inDevelopment = true;
    }
    if (process.env.VSCODE_PID !== undefined && process.env.JEST_WORKER_ID === undefined) {
        exports.appParameters.inExtension = true;
    }
};
class RequisitionHub {
    registry = new Map();
    remoteTarget;
    source;
    requestPipeline;
    constructor(source = "app") {
        this.source = source;
        this.requestPipeline = new RequisitionPipeline_1.RequisitionPipeline(this);
        this.setRemoteTarget();
    }
    static get instance() {
        return new RequisitionHub();
    }
    setRemoteTarget(target) {
        if (target) {
            this.remoteTarget = target;
        }
        else if (typeof window !== "undefined") {
            if (window.webkit) {
                this.remoteTarget = window.webkit.messageHandlers.hostChannel;
            }
            else {
                const chrome = window.chrome;
                if (chrome && chrome.webview) {
                    this.remoteTarget = chrome.webview;
                }
            }
            if (this.remoteTarget) {
                window.onNativeMessage = (message) => {
                    this.handleRemoteMessage(message);
                };
            }
            else {
                this.remoteTarget = window.parent;
                window.addEventListener("message", (message) => {
                    if (message.data.source !== "app") {
                        this.handleRemoteMessage(message.data);
                    }
                });
                if (exports.appParameters.embedded) {
                    document.addEventListener("keydown", (e) => {
                        const obj = {
                            source: this.source,
                            command: "keydown",
                            altKey: e.altKey,
                            code: e.code,
                            ctrlKey: e.ctrlKey,
                            isComposing: e.isComposing,
                            key: e.key,
                            location: e.location,
                            metaKey: e.metaKey,
                            repeat: e.repeat,
                            shiftKey: e.shiftKey,
                        };
                        window.parent.postMessage(obj, "*");
                        if (e.metaKey && (e.key === "c" || e.key === "x")) {
                            const selection = window.getSelection();
                            if (selection) {
                                this.writeToClipboard(selection.toString());
                                const element = document.activeElement;
                                if (e.key === "x" && (element instanceof HTMLInputElement
                                    || element instanceof HTMLTextAreaElement)) {
                                    if (element.selectionStart !== null) {
                                        const oldValue = element.value;
                                        const caret = Math.min(element.selectionStart, element.selectionEnd ?? 1000);
                                        element.value = oldValue.substring(0, element.selectionStart) + oldValue
                                            .substring(element.selectionEnd ?? element.selectionStart);
                                        element.selectionStart = caret;
                                        element.selectionEnd = caret;
                                    }
                                }
                            }
                        }
                    });
                    document.addEventListener("keyup", (e) => {
                        const obj = {
                            type: "keyup",
                            altKey: e.altKey,
                            code: e.code,
                            ctrlKey: e.ctrlKey,
                            isComposing: e.isComposing,
                            key: e.key,
                            location: e.location,
                            metaKey: e.metaKey,
                            repeat: e.repeat,
                            shiftKey: e.shiftKey,
                        };
                        window.parent.postMessage(obj, "*");
                    });
                }
            }
        }
    }
    register = (requestType, callback) => {
        if (!this.registry.has(requestType)) {
            this.registry.set(requestType, [callback]);
        }
        else {
            const list = this.registry.get(requestType);
            const index = list.findIndex((entry) => {
                return entry === callback;
            });
            if (index === -1) {
                list.unshift(callback);
            }
        }
    };
    unregister = (requestType, callback) => {
        if (!requestType) {
            this.registry.clear();
            return;
        }
        const list = this.registry.get(requestType);
        if (list) {
            const newList = list.filter((candidate) => {
                return candidate !== callback;
            });
            if (newList.length > 0) {
                this.registry.set(requestType, newList);
            }
            else {
                this.registry.delete(requestType);
            }
        }
    };
    registrations = (requestType) => {
        const list = this.registry.get(requestType);
        return list?.length ?? 0;
    };
    execute = async (requestType, parameter) => {
        const list = this.registry.get(requestType);
        if (list) {
            const promises = [];
            list.forEach((callback) => {
                promises.push(callback(parameter));
            });
            const results = await Promise.all(promises);
            return Promise.resolve(results.some((value) => {
                return value;
            }));
        }
        return Promise.resolve(false);
    };
    executeRemote = (requestType, parameter) => {
        if (this.remoteTarget) {
            if (this.remoteTarget.postMessage) {
                const message = {
                    source: this.source,
                    command: requestType,
                    data: parameter,
                };
                this.remoteTarget.postMessage(message, "*");
            }
            else if (this.remoteTarget.broadcastRequest) {
                void this.remoteTarget.broadcastRequest(undefined, requestType, parameter);
            }
            return true;
        }
        return false;
    };
    broadcastRequest = async (provider, requestType, parameter) => {
        let result = false;
        if (!provider) {
            result ||= await this.execute(requestType, parameter);
        }
        if (this.remoteTarget?.broadcastRequest) {
            await this.remoteTarget.broadcastRequest(provider, requestType, parameter);
            result = true;
        }
        else {
            result ||= this.executeRemote(requestType, parameter);
        }
        return result;
    };
    handleRemoteMessage(message) {
        if (message.command === "paste" && message.data) {
            const element = document.activeElement;
            const text = message.data.text;
            if (element && (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
                const dataTransfer = new DataTransfer();
                dataTransfer.setData("text/plain", text);
                const pasteEvent = new ClipboardEvent("paste", { clipboardData: dataTransfer });
                element.dispatchEvent(pasteEvent);
            }
            return;
        }
        const requestType = message.command;
        const parameter = message.data;
        const list = this.registry.get(requestType);
        if (list) {
            list.forEach((callback) => {
                void callback(parameter);
            });
        }
    }
    writeToClipboard(text) {
        if (exports.appParameters.embedded) {
            const message = {
                source: this.source,
                command: "writeClipboard",
                text,
            };
            this.remoteTarget?.postMessage?.(message, "*");
        }
        else {
            void navigator.clipboard.writeText(text);
        }
    }
}
exports.RequisitionHub = RequisitionHub;
parseAppParameters();
exports.requisitions = RequisitionHub.instance;
//# sourceMappingURL=Requisitions.js.map