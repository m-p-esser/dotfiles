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
exports.WebviewProvider = void 0;
const path = __importStar(require("path"));
const vscode_1 = require("vscode");
const Requisitions_1 = require("../../../frontend/src/supplement/Requisitions");
const extension_1 = require("../extension");
const webview_1 = require("./webview");
class WebviewProvider {
    url;
    onDispose;
    onStateChange;
    panel;
    requisitions;
    #notifyOnDispose = true;
    #caption;
    constructor(url, onDispose, onStateChange) {
        this.url = url;
        this.onDispose = onDispose;
        this.onStateChange = onStateChange;
    }
    get caption() {
        return this.#caption ?? "MySQL Shell";
    }
    set caption(value) {
        this.#caption = value;
        if (this.panel) {
            this.panel.title = value;
        }
    }
    close() {
        if (this.panel) {
            this.#notifyOnDispose = false;
            this.panel.dispose();
            this.panel = undefined;
        }
    }
    runCommand(requestType, parameter, settingName = "") {
        return this.runInPanel(() => {
            this.requisitions?.executeRemote(requestType, parameter);
            return Promise.resolve(true);
        }, settingName);
    }
    runInPanel(block, settingName) {
        const placement = settingName ? vscode_1.workspace.getConfiguration("msg.tabPosition").get(settingName) : undefined;
        return new Promise((resolve, reject) => {
            if (!this.panel) {
                if (this.caption) {
                    this.createPanel(placement).then(() => {
                        block().then(() => {
                            resolve(true);
                        }).catch((reason) => {
                            reject(reason);
                        });
                    }).catch((reason) => {
                        reject(reason);
                    });
                }
                else {
                    resolve(false);
                }
            }
            else {
                this.panel.reveal();
                block().then(() => {
                    resolve(true);
                }).catch((reason) => {
                    reject(reason);
                });
            }
        });
    }
    createPanel(placement) {
        return new Promise((resolve) => {
            void this.prepareEditorGroup(placement).then((viewColumn) => {
                this.panel = vscode_1.window.createWebviewPanel("msg-webview", this.#caption, { viewColumn, preserveFocus: true }, {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                });
                this.panel.onDidDispose(() => { this.handleDispose(); });
                this.panel.iconPath = {
                    dark: vscode_1.Uri.file(path.join(__dirname, "..", "images", "dark", "mysql.svg")),
                    light: vscode_1.Uri.file(path.join(__dirname, "..", "images", "light", "mysql.svg")),
                };
                this.requisitions = new Requisitions_1.RequisitionHub("host");
                this.requisitions.setRemoteTarget(this.panel.webview);
                this.requisitions.register("applicationDidStart", () => {
                    resolve(true);
                    (0, extension_1.printChannelOutput)("State: application did start");
                    return Promise.resolve(true);
                });
                this.requisitionsCreated();
                this.panel.webview.onDidReceiveMessage((message) => {
                    if (message.source === "app") {
                        this.requisitions?.handleRemoteMessage(message);
                    }
                });
                if (this.onStateChange) {
                    this.panel.onDidChangeViewState((event) => {
                        this.onStateChange?.(this, event.webviewPanel.active);
                    });
                }
                (0, webview_1.prepareWebviewContent)(this.panel, this.url);
            });
        });
    }
    handleDispose() {
        this.panel = undefined;
        if (this.#notifyOnDispose) {
            this.onDispose(this);
        }
    }
    requisitionsCreated() {
        if (this.requisitions) {
            this.requisitions.register("settingsChanged", this.updateVscodeSettings);
            this.requisitions.register("selectConnectionTab", this.selectConnectionTab);
            this.requisitions.register("dialogResponse", this.dialogResponse);
            this.requisitions.register("updateStatusbar", this.updateStatusbar);
            this.requisitions.register("closeInstance", this.forwardSimple.bind(this, "closeInstance"));
        }
    }
    selectConnectionTab = (details) => {
        if (this.panel) {
            return Requisitions_1.requisitions.execute("proxyRequest", {
                provider: this,
                original: { requestType: "selectConnectionTab", parameter: details },
            });
        }
        return Promise.resolve(false);
    };
    dialogResponse = (response) => {
        return Requisitions_1.requisitions.execute("proxyRequest", {
            provider: this,
            original: { requestType: "dialogResponse", parameter: response },
        });
    };
    updateStatusbar = (items) => {
        return Requisitions_1.requisitions.execute("proxyRequest", {
            provider: this,
            original: { requestType: "updateStatusbar", parameter: items },
        });
    };
    forwardSimple = (requestType) => {
        return Requisitions_1.requisitions.execute("proxyRequest", {
            provider: this,
            original: { requestType, parameter: undefined },
        });
    };
    updateVscodeSettings = (entry) => {
        return new Promise((resolve) => {
            if (entry) {
                const parts = entry.key.split(".");
                if (parts.length === 3) {
                    const configuration = vscode_1.workspace.getConfiguration(`msg.${parts[0]}`);
                    void configuration.update(`${parts[1]}.${parts[2]}`, entry.value, vscode_1.ConfigurationTarget.Global).then(() => {
                        resolve(true);
                    });
                }
            }
            resolve(false);
        });
    };
    prepareEditorGroup = async (placement) => {
        let viewColumn = (!placement || placement === "Active") ? vscode_1.ViewColumn.Active : vscode_1.ViewColumn.Beside;
        if (placement === "Beside Bottom") {
            viewColumn = vscode_1.ViewColumn.Active;
            await vscode_1.commands.executeCommand("workbench.action.editorLayoutTwoRows");
            await vscode_1.commands.executeCommand("workbench.action.focusSecondEditorGroup");
        }
        return viewColumn;
    };
}
exports.WebviewProvider = WebviewProvider;
//# sourceMappingURL=WebviewProvider.js.map