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
exports.setupInitialWelcomeWebview = void 0;
const vscode_1 = require("vscode");
const path_1 = require("path");
const os_1 = require("os");
const extension_1 = require("../extension");
const MySQLShellLauncher_1 = require("../../../frontend/src/utilities/MySQLShellLauncher");
const regedit = __importStar(require("regedit"));
const getCssWebviewContent = (rootPath) => {
    return `<style>
    body {
        background-color: var(--vscode-editor-background);
    }
    #welcome {
        z-index: 2;
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        color: var(--vscode-editor-foreground);
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    #sakilaLogo {
        margin: 8px 0px 8px 0px;
        width: 160px;
        height: 160px;
        min-height: 160px;
        min-width: 160px;
        background-color: hsl(200, 65%, 40%);
        mask-image: url(${rootPath.toString()}/images/welcome/mysqlsh.svg);
        -webkit-mask-image: url(${rootPath.toString()}/images/welcome/mysqlsh.svg);
    }
    #pages .page {
        display: flex;
        height: 250px;
        width: 100%;
        max-width: 600px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .inactivePage {
        display: none !important;
    }
    h2 {
        margin-top: 15px;
        text-align: center;
        font-size: 25pt;
        font-weight: 100;
    }
    h3 {
        margin-top: 11px;
        text-align: center;
        font-size: 14pt;
        font-weight: 400;
    }
    p {
        text-align: center;
        font-size: 11pt;
        font-weight: 100;
        line-height: 13pt;
        margin-left: 30px;
        margin-right: 30px;
    }
    .pWithImg {
        text-align: left;
        font-size: 11pt;
        font-weight: 100;
        line-height: 13pt;
        margin-left: 30px;
        margin-right: 30px;
    }
    .pError {
        color: red;
        font-weight: 400;
    }
    .links {
        display: flex;
        flex-direction: row;
        justify-content: center;
        font-size: 11pt;
        font-weight: 100;
        padding-top: 10px;
        padding-bottom: 60px;
        white-space: nowrap;
    }
    .links a {
        color: var(--vscode-textLink-foreground);
        text-decoration: none;
        font-weight: 500;
        padding-left: 30px;
        padding-right: 30px;
    }
    .welcomeControls {
        display: flex;
        width: 100%;
        max-width: 600px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    input[type=button] {
        margin: 8px 0px 0px 10px;
        width: 200px;
        height: 32px;
        color: var(--vscode-button-foreground);
        background-color: var(--vscode-button-background);
        border-style: none;
    }
    #cancelBtn {
        display: none;
    }
    .disabledBtn {
        color: var(--vscode-tab-inactiveForeground) !important;
        background-color: var(--vscode-tab-inactiveBackground) !important;
    }
    .CopyrightText {
        margin-top: 80px;
        font-size: 10px;
        font-weight: 100;
        color: var(--vscode-tab-unfocusedInactiveForeground);
    }
    #waitForConfirmation {
        width: 80px;
        display: block;
    }
    .pingEffect {
        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;
    }
    .pingEffect div {
        position: absolute;
        border: 4px solid var(--vscode-foreground);
        opacity: 1;
        border-radius: 50%;
        animation: pingEffect 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
    }
    .pingEffect div:nth-child(2) {
    animation-delay: -0.5s;
    }
    @keyframes pingEffect {
        0% {
            top: 36px;
            left: 36px;
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            top: 0px;
            left: 0px;
            width: 72px;
            height: 72px;
            opacity: 0;
        }
    }
    code {
        font-size: 10pt;
        font-weight: 400;
        line-height: 12pt;
    }
</style>
`;
};
const getRequirementsErrorWebviewContent = (requirementsError, rootPath) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MySQL Shell Requirements Error</title>
    ${getCssWebviewContent(rootPath)}
</head>
<body>
    <div id="welcome">
        <div id="sakilaLogo"></div>
        <h2>MySQL Shell for VS Code</h2>
        <div id="pages">
            <div id="page1" class="page">
                <h3>MySQL Shell Requirements Error.</h3>
                <p>The requirements of the MySQL Shell for VS Code extension could not be met.</p>
                <p id="requirementsError" class="pError">${requirementsError}</p>
                <p>You can safely remove the extension from VS Code.<br>
                    Please feel free to file a
                    <a href="https://bugs.mysql.com/report.php?category=Shell%20VSCode%20Extension">bug report</a>.</p>
            </div>
        </div>
    </div>
</body>
</html>`;
};
const getWelcomeWebviewContent = (rootPath, showVCRuntimePrompt) => {
    const pageOffset = showVCRuntimePrompt ? 1 : 0;
    const vcRuntimePageIndex = showVCRuntimePrompt ? 2 : -100;
    const vcRuntimePage = showVCRuntimePrompt ? `
        <div id="page2" class="page inactivePage">
            <h3>Installation of MS VC++ runtime libraries.</h3>
            <p>This extension requires the MS VC++ runtime libraries.
            Please download them from the following web page and install them on your system.</p>
            <p>
                <a href="https://docs.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170">
                MS Visual C++ 2019 Redistributable</a>
            </p>
            <div id="checkError" class="pError"></div>
            <h3>Click the [Check VC++ Runtime] button after completing the installation.</h3>
            <br/>
        </div>
` : ``;
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to MySQL Shell</title>
    ${getCssWebviewContent(rootPath)}
</head>
<body>
    <div id="welcome">
        <div id="sakilaLogo"></div>
        <h2>MySQL Shell for VS Code</h2>
        <div id="pages">
            <div id="page1" class="page">
                <h3>Welcome to MySQL Shell for VS Code.</h3>
                <p>This extension provides the powerful tool set of MySQL Shell
                    to users of Visual Studio Code.</p>
                <div class="links">
                    <a href="https://blogs.oracle.com/mysql/post/introducing-mysql-shell-for-vs-code">
                        Learn More &gt;</a>
                    <a href="#">Browse Tutorial &gt;</a>
                    <a href="#">Read Docs &gt;</a>
                </div>
                <p>Please click [Next >] to complete the installation of the
                    MySQL Shell for VS Code extension.</p>
            </div>
            ${vcRuntimePage}
            <div id="page3" class="page inactivePage">
                <h3>Installation of Certificate.</h3>
                <p>This extension needs a certificate to be installed on your local
                    user account in order to securely access the MySQL Shell.</p>
                <p class="pWithImg">
                    <img src="${rootPath.toString()}/images/welcome/trustSettingDlg-${(0, os_1.platform)()}.png"
                        width="171px" height="87px" alt="Trust Dialog" align="left" hspace="15px"/>
                    In the next step a security dialog ${((0, os_1.platform)() === "linux") ? "might" : "will"} be shown
                    for you to confirm the installation of the certificate.<br>
                    <br>
                    Please click [Next >] to start the installation of the
                    MySQL Shell certificate.</p>
            </div>
            <div id="page4" class="page inactivePage">
                <h3>Installation of Certificate.</h3>
                <p>Please confirm the installation of the certificate in order
                    to complete the installation of the extension.</p>
                <div id="waitForConfirmation"><div class="pingEffect"><div></div><div></div></div></div>
                <p id="certError" class="pError"></p>
            </div>
            <div id="page5" class="page inactivePage">
                <h3>Installation Completed</h3>
                <p>Thank you for installing the MySQL Shell for VS Code extension!</p>
                <p>A reload of the VS Code window is needed to be able to use the MySQL Shell.</p>
                <h3>Please click the [Reload VS Code Window] button.</h3>
            </div>
        </div>
        <form name="welcomeControls" class="welcomeControls">
            <input id="cancelBtn" alt="Cancel" type="button" value="Cancel"></input>
            <input id="nextBtn" alt="Next" type="button" value="Next >"></input>
        </form>
        <div class="CopyrightText">&copy; 2022, 2023, Oracle Corporation and/or its affiliates.</div>
    </div>
    <script>
        (function() {
            const vscode = acquireVsCodeApi();
            const pageInstallCert = 3 + ${pageOffset};
            const pageLast = 4 + ${pageOffset};
            const vcRuntimePage = ${vcRuntimePageIndex};
            const nextBtn = document.getElementById('nextBtn');
            const cancelBtn = document.getElementById('cancelBtn');
            var currentPage = 1;
            var restartWizard = false;

            function showPage(pageIndex) {
                const pagesElement = document.getElementById("pages");

                for (let i = 0; i < pagesElement.children.length; i++) {
                    pagesElement.children[i].classList.add("inactivePage");
                }

                if (pageIndex-1 < pagesElement.children.length) {
                    pagesElement.children[pageIndex-1].classList.remove("inactivePage");
                }
            }

            // Register Next button click event
            nextBtn.addEventListener('click', () => {
                // On button click, move to next page
                if (currentPage == vcRuntimePage) {
                    nextBtn.disabled = true;
                    nextBtn.classList.add("disabledBtn");
                    document.getElementById("checkError").innerHTML = "";

                    vscode.postMessage({ command: 'recheckRuntime' });
                } else {
                    currentPage += 1;
                }

                // Process handling for the new page or restart the wizard if requested
                if (restartWizard) {
                    // Go to page 1 and reset the buttons
                    restartWizard = false;
                    document.getElementById("certError").innerHTML = "";
                    nextBtn.value = "Next >";
                    cancelBtn.style.display = "none";
                    document.getElementById("waitForConfirmation").style.display = "block";
                    currentPage = 1;
                } else if (currentPage == pageInstallCert) {
                    // Try to install the cert
                    nextBtn.disabled = true;
                    nextBtn.classList.add("disabledBtn");

                    vscode.postMessage({ command: 'installCert' });
                } else if (currentPage == vcRuntimePage) {
                    nextBtn.value = "Check VC++ Runtime";
                } else if (currentPage >= pageLast) {
                    // Close the webview panel
                    vscode.postMessage({ command: 'restartVsCode' });
                    // Ensure no other page is shown
                    currentPage = pageLast + 1;
                }

                showPage(currentPage);
            });

            // Register Cancel button click event
            cancelBtn.addEventListener('click', () => {
                // Close the webview panel
                vscode.postMessage({ command: 'done' });
            });

            // Handle the message inside the webview
            window.addEventListener('message', event => {

                const message = event.data; // The JSON data our extension sent

                switch (message.command) {
                    case 'reCheckVcRuntime':
                        if (message.output.includes("true")) {
                            showPage(vcRuntimePage + 1);
                            nextBtn.value = "Next >";
                            currentPage = vcRuntimePage + 1;
                        } else {
                            const errorMessage = "VC++ runtime library installation not detected.";
                            document.getElementById("checkError").innerHTML = errorMessage;

                            showPage(vcRuntimePage);
                            currentPage = vcRuntimePage;
                        }
                        nextBtn.disabled = false;
                        nextBtn.classList.remove("disabledBtn");
                        break;

                    case 'installCertResult':
                        if (message.output.includes("true")) {
                            showPage(pageLast);

                            nextBtn.value = "Reload VS Code Window";
                            nextBtn.disabled = false;
                            nextBtn.classList.remove("disabledBtn");

                            cancelBtn.style.display = "none";
                            restartWizard = false;
                        } else if (message.output.includes("ERROR")) {
                            document.getElementById("waitForConfirmation").style.display = "none";
                            document.getElementById("certError").innerHTML = message.output;

                            nextBtn.value = "Restart Setup Wizard";
                            nextBtn.disabled = false;
                            nextBtn.classList.remove("disabledBtn");

                            cancelBtn.style.display = "block";
                            restartWizard = true;
                        }

                        break;
                }
            });
        }())
    </script>
</body>
</html>`;
};
const checkVcRuntime = () => {
    return new Promise((resolve, reject) => {
        if ((0, os_1.platform)() === "win32") {
            regedit.promisified.list([
                "HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\VisualStudio\\14.0\\VC\\Runtimes\\X64",
                "HKLM\\SOFTWARE\\Microsoft\\VisualStudio\\14.0\\VC\\Runtimes\\X64",
            ]).then((items) => {
                let cRuntimeInstalled = false;
                for (const key in items) {
                    const item = items[key];
                    if (item.exists) {
                        cRuntimeInstalled = true;
                        break;
                    }
                }
                resolve(cRuntimeInstalled);
            }).catch((reason) => {
                reject(`C++ Runtime availability could not checked: ${String(reason)}`);
            });
        }
        else {
            resolve(false);
        }
    });
};
const setupInitialWelcomeWebview = (context) => {
    context.subscriptions.push(vscode_1.commands.registerCommand("msg.runWelcomeWizard", () => {
        const panel = vscode_1.window.createWebviewPanel("mysqlShellInitialSetup", "Welcome to MySQL Shell", vscode_1.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode_1.Uri.file((0, path_1.join)(context.extensionPath, "images"))],
        });
        let requirementsError = "";
        const osName = (0, os_1.platform)();
        if (osName === "darwin" || osName === "win32") {
            const rel = (0, os_1.release)().match(/(\d*)\.(\d*)\.(\d*)/);
            const mainVersion = rel && rel.length > 1 ? parseInt(rel[1], 10) : 0;
            if (osName === "darwin" && mainVersion < 20) {
                requirementsError = "This extension requires macOS 11 Big Sur or later.";
            }
            else if (osName === "win32" && mainVersion < 10) {
                requirementsError = "This extension requires Windows 10 or later.";
            }
        }
        const extensionPath = panel.webview.asWebviewUri(vscode_1.Uri.file(context.extensionPath));
        if (requirementsError) {
            panel.webview.html = getRequirementsErrorWebviewContent(requirementsError, extensionPath);
        }
        else {
            if (osName === "win32") {
                checkVcRuntime().then((result) => {
                    panel.webview.html = getWelcomeWebviewContent(extensionPath, !result);
                }).catch((reason) => {
                    (0, extension_1.printChannelOutput)(String(reason), true);
                    panel.webview.html = getWelcomeWebviewContent(extensionPath, false);
                });
            }
            else {
                panel.webview.html = getWelcomeWebviewContent(extensionPath, false);
            }
        }
        panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case "installCert": {
                    const configuration = vscode_1.workspace.getConfiguration(`msg.debugLog`);
                    const logLevel = configuration.get("level", "INFO");
                    const config = {
                        rootPath: context.extensionPath,
                        inDevelopment: context.extensionMode === vscode_1.ExtensionMode.Development,
                        parameters: [
                            "--", "gui", "core", "install-shell-web-certificate",
                            "--replace_existing=true",
                        ],
                        logLevel,
                        onStdOutData: (output) => {
                            (0, extension_1.printChannelOutput)(output);
                            if (!output.startsWith("Starting embedded MySQL Shell") && !output.includes("DEBUG")) {
                                void panel.webview.postMessage({ command: "installCertResult", output });
                            }
                        },
                    };
                    MySQLShellLauncher_1.MySQLShellLauncher.runMysqlShell(config);
                    return;
                }
                case "restartVsCode": {
                    panel.dispose();
                    void vscode_1.commands.executeCommand("workbench.action.reloadWindow");
                    return;
                }
                case "recheckRuntime": {
                    checkVcRuntime().then((result) => {
                        void panel.webview.postMessage({ command: "reCheckVcRuntime", output: result.toString() });
                    }).catch((reason) => {
                        (0, extension_1.printChannelOutput)(String(reason));
                    });
                    return;
                }
                case "done": {
                    panel.dispose();
                    return;
                }
                default:
            }
        }, undefined, context.subscriptions);
    }));
};
exports.setupInitialWelcomeWebview = setupInitialWelcomeWebview;
//# sourceMappingURL=WelcomeWebviewProvider.js.map