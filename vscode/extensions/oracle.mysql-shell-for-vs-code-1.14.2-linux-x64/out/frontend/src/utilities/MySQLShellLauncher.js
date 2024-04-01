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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLShellLauncher = void 0;
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const net = __importStar(require("net"));
const os_1 = __importDefault(require("os"));
const Requisitions_1 = require("../supplement/Requisitions");
const helpers_1 = require("./helpers");
const MessageScheduler_1 = require("../communication/MessageScheduler");
const file_utilities_1 = require("./file-utilities");
class MySQLShellLauncher {
    onOutput;
    onError;
    onExit;
    static extensionShellUserConfigFolderBaseName = "mysqlsh-gui";
    shellProcess;
    launchDetails = { port: 0, singleUserToken: "" };
    constructor(onOutput, onError, onExit) {
        this.onOutput = onOutput;
        this.onError = onError;
        this.onExit = onExit;
    }
    static getShellUserConfigDir = (inDevelopment) => {
        let shellUserConfigDir;
        shellUserConfigDir = process.env.MYSQLSH_GUI_CUSTOM_CONFIG_DIR ?? "";
        if (shellUserConfigDir.length === 0) {
            shellUserConfigDir = Requisitions_1.appParameters.get("shellUserConfigDir") ?? "";
        }
        if (shellUserConfigDir.length === 0 || !fs_1.default.existsSync(shellUserConfigDir)) {
            if (inDevelopment) {
                if (os_1.default.platform() === "win32") {
                    shellUserConfigDir = path_1.default.join(os_1.default.homedir(), "AppData", "Roaming", "MySQL", "mysqlsh");
                }
                else {
                    shellUserConfigDir = path_1.default.join(os_1.default.homedir(), ".mysqlsh");
                }
            }
            else {
                if (os_1.default.platform() === "win32") {
                    shellUserConfigDir = path_1.default.join(os_1.default.homedir(), "AppData", "Roaming", "MySQL", MySQLShellLauncher.extensionShellUserConfigFolderBaseName);
                }
                else {
                    shellUserConfigDir = path_1.default.join(os_1.default.homedir(), `.${MySQLShellLauncher.extensionShellUserConfigFolderBaseName}`);
                }
            }
        }
        return shellUserConfigDir;
    };
    static runMysqlShell = (config) => {
        const shellPath = MySQLShellLauncher.getShellPath(config.rootPath);
        const shellUserConfigDir = MySQLShellLauncher.getShellUserConfigDir(config.inDevelopment);
        const embedded = shellPath.startsWith(config.rootPath) ? "embedded " : "";
        config.onStdOutData(`Starting ${embedded}MySQL Shell, using config dir '${shellUserConfigDir}' ...`);
        if (!fs_1.default.existsSync(shellUserConfigDir)) {
            fs_1.default.mkdirSync(shellUserConfigDir, { recursive: true });
        }
        const shellProcess = child_process_1.default.spawn(shellPath, config.parameters, {
            env: {
                ...process.env,
                LOG_LEVEL: config.logLevel,
                MYSQLSH_USER_CONFIG_HOME: shellUserConfigDir,
                MYSQLSH_TERM_COLOR_MODE: "nocolor",
            },
        });
        if (shellProcess.stdin && config.processInput) {
            shellProcess.stdin.setDefaultEncoding("utf-8");
            shellProcess.stdin.write(`${config.processInput}\n`);
            shellProcess.stdin.end();
        }
        const stdDataOut = (data) => {
            config.onStdOutData(data.toString());
        };
        shellProcess.stdout?.on("data", stdDataOut);
        const onError = (error) => {
            config.onError?.(new Error(`Error while starting MySQL Shell: ${error.message}`));
        };
        shellProcess.on("error", onError);
        if (config.onStdErrData) {
            const stdErrorDataOut = (data) => {
                config.onStdErrData?.(data.toString());
            };
            shellProcess.stderr.on("data", stdErrorDataOut);
        }
        else {
            shellProcess.stderr?.on("data", stdDataOut);
        }
        if (config.onExit) {
            shellProcess.on("exit", config.onExit);
        }
        return shellProcess;
    };
    static findFreePort = () => {
        return new Promise((resolve, reject) => {
            const server = net.createServer();
            let errorEncountered = false;
            server.on("error", (err) => {
                server.close();
                if (!errorEncountered) {
                    errorEncountered = true;
                    reject(err);
                }
            });
            server.listen(0, () => {
                const address = server.address();
                if (!address || typeof address === "string" || address.port === 0) {
                    reject(new Error("Unable to get a port for the backend"));
                }
                else {
                    server.close();
                    if (!errorEncountered) {
                        errorEncountered = true;
                        resolve(address.port);
                    }
                }
            });
        });
    };
    static getShellPath = (rootPath) => {
        let shellPath = path_1.default.join(rootPath, "shell", "bin", "mysqlsh");
        if (os_1.default.platform() === "win32") {
            shellPath += ".exe";
        }
        if (!fs_1.default.existsSync(shellPath)) {
            if (os_1.default.platform() === "win32") {
                shellPath = (0, file_utilities_1.findExecutable)("mysqlsh");
            }
            else {
                shellPath = "mysqlsh";
            }
        }
        return shellPath;
    };
    static checkPort = (port) => {
        return new Promise((resolve, reject) => {
            const socket = new net.Socket();
            socket.on("timeout", () => {
                socket.destroy();
                resolve(false);
            });
            socket.on("connect", () => {
                socket.destroy();
                resolve(true);
            });
            socket.on("error", (error) => {
                if (error.code !== "ECONNREFUSED") {
                    reject(error);
                }
                else {
                    resolve(false);
                }
            });
            socket.connect(port, "0.0.0.0");
        });
    };
    exitProcess() {
        return new Promise((resolve) => {
            const done = () => {
                this.shellProcess = undefined;
                this.launchDetails = { port: 0, singleUserToken: "" };
                resolve();
            };
            if (this.shellProcess?.pid) {
                this.shellProcess.on("close", done);
                this.shellProcess.kill();
            }
            else {
                done();
            }
        });
    }
    startShellAndConnect = (rootPath, inDevelopment, secure, logLevel = "INFO", target, forwardPort) => {
        if (target) {
            const url = new URL(target);
            try {
                MessageScheduler_1.MessageScheduler.get.connect({ url: new URL(target) }).then(() => {
                    this.launchDetails.port = Number(url.port ?? 8000);
                    this.launchDetails.singleUserToken = url.searchParams.get("token") ?? "";
                    void Requisitions_1.requisitions.execute("connectedToUrl", url);
                }).catch((reason) => {
                    this.onOutput(`Could not establish websocket connection: ${String(reason)}`);
                    void Requisitions_1.requisitions.execute("connectedToUrl", undefined);
                });
            }
            catch (e) {
                this.onOutput("Error while parsing the external URL string: " + String(e));
                void Requisitions_1.requisitions.execute("connectedToUrl", undefined);
            }
        }
        else {
            const launchShellUsingPort = (port) => {
                this.launchDetails.singleUserToken = (0, helpers_1.uuid)();
                this.launchDetails.port = port;
                const secureString = secure ? "secure={}, " : "";
                const parameters = [
                    "--no-defaults",
                    "--py",
                    "-e",
                    `gui.start.web_server(port=${this.launchDetails.port}, ${secureString}read_token_on_stdin=True)`,
                ];
                const onOutput = (output) => {
                    if (output.includes("Mode: Single user")) {
                        const protocol = secure ? "https" : "http";
                        let host = "localhost";
                        if (Requisitions_1.appParameters.testsRunning && !Requisitions_1.appParameters.inExtension) {
                            host = "127.0.0.1";
                        }
                        const url = new URL(`${protocol}://${host}:${port}/` +
                            `?token=${this.launchDetails.singleUserToken}`);
                        const options = {
                            url,
                            shellConfigDir: MySQLShellLauncher.getShellUserConfigDir(inDevelopment),
                        };
                        if (forwardPort) {
                            this.onOutput("Establishing the port forwarding session to remote ssh server...");
                            forwardPort(url).then((redirectUrl) => {
                                MessageScheduler_1.MessageScheduler.get.connect(options).then(() => {
                                    void Requisitions_1.requisitions.execute("connectedToUrl", redirectUrl);
                                }).catch((reason) => {
                                    this.onError(new Error(`Could not establish websocket connection: ${String(reason)}`));
                                    void Requisitions_1.requisitions.execute("connectedToUrl", undefined);
                                });
                            }).catch((reason) => {
                                this.onError(new Error(`Could not establish the port forwarding: ${String(reason)}`));
                            });
                        }
                        else {
                            MessageScheduler_1.MessageScheduler.get.connect(options).then(() => {
                                void Requisitions_1.requisitions.execute("connectedToUrl", url);
                            }).catch((reason) => {
                                this.onError(new Error(`Could not establish websocket connection: ${String(reason)}`));
                                void Requisitions_1.requisitions.execute("connectedToUrl", undefined);
                                setTimeout(() => { void this.exitProcess(); }, 0);
                            });
                        }
                    }
                    this.onOutput(output);
                };
                this.shellProcess = MySQLShellLauncher.runMysqlShell({
                    rootPath,
                    inDevelopment,
                    logLevel,
                    parameters,
                    onStdOutData: onOutput,
                    onError: this.onError,
                    onExit: this.onExit,
                    processInput: this.launchDetails.singleUserToken,
                });
            };
            if (Requisitions_1.appParameters.testsRunning) {
                launchShellUsingPort(Math.floor(Math.random() * 20000) + 20000);
            }
            else {
                let port = 33336;
                if (process.env.MYSQLSH_GUI_CUSTOM_PORT !== undefined) {
                    const customPort = parseInt(process.env.MYSQLSH_GUI_CUSTOM_PORT, 10);
                    if (!isNaN(customPort)) {
                        port = customPort;
                    }
                    else {
                        console.log(`MYSQLSH_GUI_CUSTOM_PORT is not a number, using 33336.`);
                    }
                }
                void MySQLShellLauncher.checkPort(port).then((inUse) => {
                    if (!inUse) {
                        launchShellUsingPort(port);
                    }
                    else {
                        this.onOutput("Finding free port...");
                        MySQLShellLauncher.findFreePort().then((port) => {
                            launchShellUsingPort(port);
                        }).catch((error) => {
                            if (error instanceof Error) {
                                this.onError(error);
                            }
                            else {
                                this.onError(new Error(String(error)));
                            }
                        });
                    }
                });
            }
        }
    };
}
exports.MySQLShellLauncher = MySQLShellLauncher;
//# sourceMappingURL=MySQLShellLauncher.js.map