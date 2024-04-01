"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShellTask = void 0;
const MessageScheduler_1 = require("../communication/MessageScheduler");
const Protocol_1 = require("../communication/Protocol");
const ProtocolGui_1 = require("../communication/ProtocolGui");
const ShellInterfaceShellSession_1 = require("../supplement/ShellInterface/ShellInterfaceShellSession");
const helpers_1 = require("../utilities/helpers");
class ShellTask {
    caption;
    promptCallback;
    messageCallback;
    currentStatus;
    statusCallback;
    currentProgress;
    constructor(caption, promptCallback, messageCallback) {
        this.caption = caption;
        this.promptCallback = promptCallback;
        this.messageCallback = messageCallback;
        this.currentStatus = "pending";
    }
    get status() {
        return this.currentStatus;
    }
    get percentageDone() {
        return this.currentProgress;
    }
    static getCurrentTimeStamp() {
        return new Date().toISOString().replace("T", " ").slice(0, -1);
    }
    setStatusCallback(callback) {
        this.statusCallback = callback;
    }
    async runTask(shellArgs, dbConnectionId, responses) {
        this.setStatus("running");
        this.sendMessage(`[${ShellTask.getCurrentTimeStamp()}] [INFO] Starting Task: ${this.caption}\n\n`);
        const requestId = (0, helpers_1.uuid)();
        let shellSession;
        let responseIndex = 0;
        const handleData = (data, final) => {
            if (data.moduleSessionId) {
                shellSession = new ShellInterfaceShellSession_1.ShellInterfaceShellSession(data.moduleSessionId);
            }
            if (this.isShellFeedbackRequest(data) && shellSession) {
                if (responses && responseIndex < responses.length) {
                    void shellSession.sendReply(requestId, Protocol_1.ShellPromptResponseType.Ok, responses[responseIndex++]);
                }
                else {
                    void this.promptCallback(data.prompt, data.type === "password").then((value) => {
                        if (shellSession) {
                            if (value) {
                                void shellSession.sendReply(requestId, Protocol_1.ShellPromptResponseType.Ok, value);
                            }
                            else {
                                void shellSession.sendReply(requestId, Protocol_1.ShellPromptResponseType.Cancel, "");
                            }
                        }
                    });
                }
            }
            else if (this.isShellSimpleResult(data)) {
                if (data.info && this.statusCallback !== undefined) {
                    const group = Array.from(data.info.matchAll(/(\d+)%\scompleted/gm), (m) => { return m[1]; });
                    if (group.length > 0) {
                        const percentage = parseInt(group[0], 10);
                        if (!isNaN(percentage) && this.currentProgress !== percentage) {
                            this.currentProgress = percentage;
                            this.statusCallback(this.currentStatus);
                        }
                    }
                }
                this.sendMessage(data.info ?? data.status);
            }
            if (final) {
                this.setStatus("done");
                this.sendMessage(`\n[${ShellTask.getCurrentTimeStamp()}] [INFO] ` +
                    `Task '${this.caption}' completed successfully.\n\n`);
                if (shellSession) {
                    void shellSession.closeShellSession();
                }
            }
        };
        try {
            const response = await MessageScheduler_1.MessageScheduler.get.sendRequest({
                requestType: ProtocolGui_1.ShellAPIGui.GuiShellStartSession,
                requestId,
                parameters: {
                    args: {
                        dbConnectionId,
                        shellArgs,
                    },
                },
                onData: (data) => {
                    if (data.result) {
                        handleData(data.result, false);
                    }
                },
            });
            if (response.result) {
                handleData(response.result, true);
            }
        }
        catch (reason) {
            this.currentStatus = "error";
            this.sendMessage(`[${ShellTask.getCurrentTimeStamp()}] [ERROR]: ${String(reason)}\n\n`);
            if (shellSession) {
                void shellSession.closeShellSession();
            }
        }
    }
    setStatus(status) {
        this.currentStatus = status;
        this.statusCallback?.(status);
    }
    sendMessage(message) {
        if (message) {
            this.messageCallback(message);
        }
    }
    isShellFeedbackRequest(response) {
        return response.type !== undefined;
    }
    isShellSimpleResult(response) {
        const candidate = response;
        return candidate.info !== undefined || candidate.error !== undefined || candidate.note !== undefined ||
            candidate.promptDescriptor !== undefined || candidate.status !== undefined
            || candidate.warning !== undefined;
    }
}
exports.ShellTask = ShellTask;
//# sourceMappingURL=ShellTask.js.map