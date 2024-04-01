"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDSCommandHandler = void 0;
const vscode_1 = require("vscode");
const os_1 = require("os");
const fs_1 = require("fs");
const extension_1 = require("./extension");
const OCITreeProvider_1 = require("./tree-providers/OCITreeProvider");
const Types_1 = require("../../frontend/src/app-logic/Types");
const DialogWebviewProvider_1 = require("./web-views/DialogWebviewProvider");
const SchemaMySQLTreeItem_1 = require("./tree-providers/ConnectionsTreeProvider/SchemaMySQLTreeItem");
const ShellInterfaceShellSession_1 = require("../../frontend/src/supplement/ShellInterface/ShellInterfaceShellSession");
const ShellInterface_1 = require("../../frontend/src/supplement/ShellInterface/ShellInterface");
const WebSession_1 = require("../../frontend/src/supplement/WebSession");
const Requisitions_1 = require("../../frontend/src/supplement/Requisitions");
const ShellInterface_2 = require("../../frontend/src/supplement/ShellInterface");
const MySQL_1 = require("../../frontend/src/communication/MySQL");
class MDSCommandHandler {
    dialogManager = new DialogWebviewProvider_1.DialogWebviewManager();
    shellSession = new ShellInterfaceShellSession_1.ShellInterfaceShellSession();
    ociTreeDataProvider;
    setup = (host) => {
        this.ociTreeDataProvider = new OCITreeProvider_1.OciTreeDataProvider();
        host.context.subscriptions.push(vscode_1.window.registerTreeDataProvider("msg.oci", this.ociTreeDataProvider));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.refreshOciProfiles", () => {
            this.ociTreeDataProvider.refresh();
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.configureOciProfiles", () => {
            let ociConfigFilePath = `${(0, os_1.homedir)()}/.oci/config`;
            if (process.env.MYSQLSH_OCI_CONFIG_FILE !== undefined) {
                ociConfigFilePath = process.env.MYSQLSH_OCI_CONFIG_FILE;
            }
            const configFile = vscode_1.Uri.file(ociConfigFilePath);
            if (!(0, fs_1.existsSync)(configFile.fsPath)) {
                const workspaceEdit = new vscode_1.WorkspaceEdit();
                void workspaceEdit.createFile(configFile, { ignoreIfExists: true });
                void vscode_1.workspace.applyEdit(workspaceEdit).then(() => {
                    void vscode_1.workspace.openTextDocument(configFile).then((doc) => {
                        void vscode_1.window.showTextDocument(doc, 1, false).then((editor) => {
                            void editor.edit((edit) => {
                                const firstLine = doc.lineAt(0);
                                const lastLine = doc.lineAt(doc.lineCount - 1);
                                const textRange = new vscode_1.Range(firstLine.range.start, lastLine.range.end);
                                edit.replace(textRange, ";To add a new OCI Profile, please follow these instructions.\n" +
                                    ";https://docs.oracle.com/en-us/iaas/Content/API/Concepts/" +
                                    "devguidesetupprereq.htm.\n" +
                                    ";Then paste your OCI Config here, replacing these lines and save.\n" +
                                    ";Click the Reload icon in the ORACLE CLOUD INFRASTRUCTURE View.");
                            }).then(() => {
                                const position = editor.selection.start;
                                editor.selection = new vscode_1.Selection(position, position);
                            });
                        });
                    });
                });
            }
            else {
                void vscode_1.workspace.openTextDocument(configFile).then((doc) => {
                    void vscode_1.window.showTextDocument(doc, 1, false);
                });
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.createRouterEndpoint", async (item) => {
            if (item?.dbSystem.id) {
                await this.showMdsEndpointDialog(item.dbSystem, item.compartment, item.profile, host);
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.getProfileInfo", (item) => {
            if (item && item.profile.profile) {
                this.showNewJsonDocument(`${item.profile.profile.toString()} Info.json`, JSON.stringify(item.profile, null, 4));
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.setDefaultProfile", async (item) => {
            if (item && item.profile.profile) {
                vscode_1.window.setStatusBarMessage(`Setting current config profile to ${item.profile.profile} ...`, 10000);
                try {
                    await this.shellSession.mds.setDefaultConfigProfile(item.profile.profile);
                    await vscode_1.commands.executeCommand("msg.mds.refreshOciProfiles");
                    vscode_1.window.setStatusBarMessage(`Default config profile set to ${item.profile.profile}.`, 5000);
                }
                catch (reason) {
                    await vscode_1.window.showErrorMessage(`Error while setting default config profile: ${String(reason)}`);
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.getCompartmentInfo", (item) => {
            if (item && item.compartment.id) {
                this.showNewJsonDocument(`${item.compartment.name.toString()} Info.json`, JSON.stringify(item.compartment, null, 4));
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.setCurrentCompartment", async (item) => {
            if (item && item.compartment.id) {
                vscode_1.window.setStatusBarMessage(`Setting current compartment to ${item.compartment.name} ...`, 10000);
                try {
                    await this.shellSession.mds.setCurrentCompartment({
                        compartmentId: item.compartment.id,
                        configProfile: item.profile.profile,
                        interactive: false,
                        raiseExceptions: true,
                    });
                    await vscode_1.commands.executeCommand("msg.mds.refreshOciProfiles");
                    vscode_1.window.setStatusBarMessage(`Current compartment set to ${item.compartment.name}.`, 5000);
                }
                catch (reason) {
                    await vscode_1.window.showErrorMessage(`Error while setting current compartment: ${String(reason)}`);
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.getDbSystemInfo", async (item) => {
            if (item?.dbSystem.id) {
                try {
                    const system = await this.shellSession.mds.getMdsMySQLDbSystem(item.profile.profile, item.dbSystem.id);
                    this.showNewJsonDocument(`${item.dbSystem.displayName ?? "<unknown>"} Info.json`, JSON.stringify(system, null, 4));
                }
                catch (reason) {
                    void vscode_1.window.showErrorMessage(`Error while fetching the DB System data: ${String(reason)}`);
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.startDbSystem", async (item) => {
            if (item?.dbSystem.id) {
                const shellArgs = [
                    "--",
                    "mds",
                    "start",
                    "db-system",
                    `--db_system_id=${item.dbSystem.id.toString()}`,
                    `--config_profile=${item.profile.profile.toString()}`,
                    "--await_completion=true",
                    "--raise_exceptions=true",
                ];
                await host.addNewShellTask("Start DB System", shellArgs, undefined, false);
                await vscode_1.commands.executeCommand("msg.mds.refreshOciProfiles");
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.stopDbSystem", async (item) => {
            if (item?.dbSystem.id) {
                const shellArgs = [
                    "--",
                    "mds",
                    "stop",
                    "db-system",
                    `--db_system_id=${item.dbSystem.id.toString()}`,
                    `--config_profile=${item.profile.profile.toString()}`,
                    "--await_completion=true",
                    "--raise_exceptions=true",
                ];
                await host.addNewShellTask("Stop DB System", shellArgs, undefined, false);
                await vscode_1.commands.executeCommand("msg.mds.refreshOciProfiles");
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.restartDbSystem", async (item) => {
            if (item?.dbSystem.id) {
                const shellArgs = [
                    "--",
                    "mds",
                    "restart",
                    "db-system",
                    `--db_system_id=${item.dbSystem.id.toString()}`,
                    `--config_profile=${item.profile.profile.toString()}`,
                    "--await_completion=true",
                    "--raise_exceptions=true",
                ];
                await host.addNewShellTask("Restart DB System", shellArgs, undefined, false);
                await vscode_1.commands.executeCommand("msg.mds.refreshOciProfiles");
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.addHWCluster", async (item) => {
            if (item && item.dbSystem && item.dbSystem.id && item.compartment && item.profile) {
                await this.showMdsHWClusterDialog(item.dbSystem, item.compartment, item.profile, host);
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.deleteDbSystem", async (item) => {
            if (item?.dbSystem.id) {
                const shellArgs = [
                    "--",
                    "mds",
                    "delete",
                    "db-system",
                    `--db_system_id=${item.dbSystem.id.toString()}`,
                    `--config_profile=${item.profile.profile.toString()}`,
                    "--await_completion=true",
                    "--raise_exceptions=true",
                ];
                await host.addNewShellTask("Delete DB System", shellArgs, undefined, false);
                await vscode_1.commands.executeCommand("msg.mds.refreshOciProfiles");
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.startHWCluster", async (item) => {
            if (item?.dbSystem.id) {
                const shellArgs = [
                    "--",
                    "mds",
                    "start",
                    "heat-wave-cluster",
                    `--db_system_id=${item.dbSystem.id.toString()}`,
                    `--config_profile=${item.profile.profile.toString()}`,
                    "--await_completion=true",
                    "--raise_exceptions=true",
                ];
                await host.addNewShellTask("Start HeatWave Cluster", shellArgs, undefined, false);
                await vscode_1.commands.executeCommand("msg.mds.refreshOciProfiles");
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.stopHWCluster", async (item) => {
            if (item?.dbSystem.id) {
                const shellArgs = [
                    "--",
                    "mds",
                    "stop",
                    "heat-wave-cluster",
                    `--db_system_id=${item.dbSystem.id.toString()}`,
                    `--config_profile=${item.profile.profile.toString()}`,
                    "--await_completion=true",
                    "--raise_exceptions=true",
                ];
                await host.addNewShellTask("Stop HeatWave Cluster", shellArgs, undefined, false);
                await vscode_1.commands.executeCommand("msg.mds.refreshOciProfiles");
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.restartHWCluster", async (item) => {
            if (item?.dbSystem.id) {
                const shellArgs = [
                    "--",
                    "mds",
                    "restart",
                    "heat-wave-cluster",
                    `--db_system_id=${item.dbSystem.id.toString()}`,
                    `--config_profile=${item.profile.profile.toString()}`,
                    "--await_completion=true",
                    "--raise_exceptions=true",
                ];
                await host.addNewShellTask("Restart HeatWave Cluster", shellArgs, undefined, false);
                await vscode_1.commands.executeCommand("msg.mds.refreshOciProfiles");
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.rescaleHWCluster", async (item) => {
            if (item && item.dbSystem && item.dbSystem.id && item.compartment && item.profile) {
                await this.showMdsHWClusterDialog(item.dbSystem, item.compartment, item.profile, host);
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.deleteHWCluster", async (item) => {
            if (item?.dbSystem.id) {
                const shellArgs = [
                    "--",
                    "mds",
                    "delete",
                    "heat-wave-cluster",
                    `--db_system_id=${item.dbSystem.id.toString()}`,
                    `--config_profile=${item.profile.profile.toString()}`,
                    "--await_completion=true",
                    "--raise_exceptions=true",
                ];
                await host.addNewShellTask("Delete HeatWave Cluster", shellArgs, undefined, false);
                await vscode_1.commands.executeCommand("msg.mds.refreshOciProfiles");
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.getComputeInstance", (item) => {
            if (item && item.compute.id) {
                this.showNewJsonDocument(`${item.compute.displayName ?? "<unknown>"} Info.json`, JSON.stringify(item.compute, null, 4));
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.getBastion", async (item) => {
            if (item && item.bastion.id) {
                try {
                    const bastion = await this.shellSession.mds.getMdsBastion(item.profile.profile, item.bastion.id);
                    this.showNewJsonDocument(`${bastion.name ?? "<unknown>"} Info.json`, JSON.stringify(bastion, null, 4));
                }
                catch (reason) {
                    await vscode_1.window.showErrorMessage(`Error while fetching the bastion data: ${String(reason)}`);
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.getLoadBalancer", (item) => {
            if (item && item.loadBalancer) {
                this.showNewJsonDocument(`${item.loadBalancer.displayName ?? "<unknown>"} Info.json`, JSON.stringify(item.loadBalancer, null, 4));
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.showTaskOutput", () => {
            extension_1.taskOutputChannel.show();
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.deleteBastion", async (item) => {
            if (item && item.bastion.id) {
                const shellArgs = [
                    "--",
                    "mds",
                    "delete",
                    "bastion",
                    `--bastion_id=${item.bastion.id.toString()}`,
                    `--config_profile=${item.profile.profile.toString()}`,
                    "--await_deletion=true",
                    "--raise_exceptions=true",
                ];
                await host.addNewShellTask("Delete Bastion", shellArgs);
                await vscode_1.commands.executeCommand("msg.mds.refreshOciProfiles");
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.setCurrentBastion", async (item) => {
            if (item && item.bastion.id) {
                vscode_1.window.setStatusBarMessage(`Setting current bastion to ${item.bastion.name} ...`, 10000);
                try {
                    await this.shellSession.mds.setCurrentBastion({
                        bastionId: item.bastion.id,
                        configProfile: item.profile.profile,
                        interactive: false,
                        raiseExceptions: true,
                    });
                    await vscode_1.commands.executeCommand("msg.mds.refreshOciProfiles");
                    vscode_1.window.setStatusBarMessage(`Current compartment set to ${item.bastion.name}.`, 5000);
                }
                catch (reason) {
                    await vscode_1.window.showErrorMessage(`Error while setting current bastion: ` +
                        `${String(reason)}`);
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.refreshOnBastionActiveState", async (item) => {
            if (item && item.bastion.id) {
                const shellArgs = [
                    "--",
                    "mds",
                    "get",
                    "bastion",
                    `--bastion_id=${item.bastion.id.toString()}`,
                    `--config_profile=${item.profile.profile.toString()}`,
                    "--await_state=ACTIVE",
                    "--raise_exceptions=true",
                ];
                await host.addNewShellTask("Refresh Bastion", shellArgs);
                await vscode_1.commands.executeCommand("msg.mds.refreshOciProfiles");
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.deleteComputeInstance", async (item) => {
            if (item && item.compute.id) {
                const shellArgs = [
                    "--",
                    "mds",
                    "delete",
                    "compute_instance",
                    `--instance_id=${item.compute.id}`,
                    `--config_profile=${item.profile.profile}`,
                    "--await_deletion=true",
                    "--raise_exceptions=true",
                ];
                await host.addNewShellTask("Delete Compute Instance", shellArgs);
                await vscode_1.commands.executeCommand("msg.mds.refreshOciProfiles");
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.openBastionSshSession", async (item) => {
            if (item && item.shellSession && item.shellSession.mds && item.compute.id) {
                vscode_1.window.setStatusBarMessage("Opening Bastion Session ...", 10000);
                try {
                    const session = await item.shellSession.mds.createBastionSession(item.profile.profile, item.compute.id, "MANAGED_SSH", item.compute.compartmentId, true, (data) => {
                        if (data.message) {
                            vscode_1.window.setStatusBarMessage(data.message);
                        }
                    });
                    vscode_1.window.setStatusBarMessage("Bastion Session available, opening Terminal ...", 5000);
                    if (session?.bastionId && this.isPortForwardingData(session.targetResourceDetails)) {
                        const terminal = vscode_1.window.createTerminal(`Terminal ${item.name}`);
                        const sshHost = `${session.id}@host.bastion. ${item.profile.region}.oci.oraclecloud.com`;
                        const sshTargetIp = session.targetResourceDetails.targetResourcePrivateIpAddress;
                        if (sshTargetIp) {
                            const sshTargetPort = session.targetResourceDetails.targetResourcePort;
                            if (sshTargetPort) {
                                terminal.sendText(`ssh -o ProxyCommand="ssh -W %h:%p -p 22 ${sshHost}"` +
                                    ` -p ${sshTargetPort} opc@${sshTargetIp}`);
                                terminal.sendText("clear");
                                terminal.show();
                            }
                        }
                    }
                }
                catch (reason) {
                    await vscode_1.window.showErrorMessage(`Error while creating the bastion session: ${String(reason)}`);
                }
            }
        }));
        host.context.subscriptions.push(vscode_1.commands.registerCommand("msg.mds.loadToHeatWave", async (entry, items) => {
            if (entry) {
                const schemas = [];
                if (items && items.length > 0) {
                    items?.forEach((schema) => {
                        if (schema instanceof SchemaMySQLTreeItem_1.SchemaMySQLTreeItem
                            && schema.parent.treeItem.details.caption === entry.parent.treeItem.details.caption) {
                            schemas.push(schema.name);
                        }
                    });
                }
                else {
                    schemas.push(entry.treeItem.name);
                }
                if (schemas.length > 0) {
                    try {
                        const allSchemas = await entry?.treeItem.backend.getCatalogObjects("Schema");
                        if (allSchemas) {
                            await this.showMdsHWLoadDataDialog(entry.treeItem.connectionId, schemas, allSchemas, host);
                        }
                    }
                    catch (reason) {
                        await vscode_1.window.showErrorMessage(`Error retrieving schema list: ${String(reason)}`);
                    }
                }
            }
        }));
    };
    showNewJsonDocument(title, text) {
        const path = `${(0, os_1.homedir)()}/${title}`;
        const scheme = (0, fs_1.existsSync)(path) ? "file" : "untitled";
        const uri = vscode_1.Uri.parse(`${scheme}:${path}`);
        vscode_1.workspace.openTextDocument(uri).then((doc) => {
            void vscode_1.window.showTextDocument(doc, 1, false).then((editor) => {
                void editor.edit((edit) => {
                    const firstLine = doc.lineAt(0);
                    const lastLine = doc.lineAt(doc.lineCount - 1);
                    const textRange = new vscode_1.Range(firstLine.range.start, lastLine.range.end);
                    edit.replace(textRange, text);
                }).then(() => {
                    const position = editor.selection.start;
                    editor.selection = new vscode_1.Selection(position, position);
                });
                void vscode_1.languages.setTextDocumentLanguage(doc, "json");
            });
        }, (error) => {
            void vscode_1.window.showErrorMessage(`Error while showing the document: ${String(error)}`);
        });
    }
    async showMdsHWClusterDialog(dbSystem, compartment, profile, host) {
        const statusbarItem = vscode_1.window.createStatusBarItem();
        statusbarItem.text = `$(loading~spin) Fetching List of MDS HeatWave Cluster Shapes...`;
        statusbarItem.show();
        try {
            const summaries = await this.shellSession.mds.listDbSystemShapes("HEATWAVECLUSTER", profile.profile, compartment.id);
            statusbarItem.hide();
            const title = (dbSystem.heatWaveCluster && dbSystem.heatWaveCluster.lifecycleState !== "DELETED")
                ? "Rescale the MySQL HeatWave Cluster"
                : "Configure the MySQL HeatWave Cluster";
            const request = {
                id: "mdsHWClusterDialog",
                type: Types_1.MdsDialogType.MdsHeatWaveCluster,
                title,
                parameters: { shapes: summaries },
                values: {
                    clusterSize: dbSystem?.heatWaveCluster?.clusterSize,
                    shapeName: dbSystem?.heatWaveCluster?.shapeName,
                },
            };
            const response = await this.dialogManager.showDialog(request, title);
            if (!response || response.closure !== Types_1.DialogResponseClosure.Accept) {
                return;
            }
            if (response.data) {
                const clusterSize = response.data.clusterSize;
                const shapeName = response.data.shapeName;
                if (!dbSystem.heatWaveCluster || dbSystem.heatWaveCluster.lifecycleState === "DELETED") {
                    const shellArgs = [
                        "--",
                        "mds",
                        "create",
                        "heat-wave-cluster",
                        `--db_system_id=${dbSystem.id.toString()}`,
                        `--cluster_size=${clusterSize.toString()}`,
                        `--shape_name=${shapeName}`,
                        `--config_profile=${profile.profile.toString()}`,
                        "--await_completion=true",
                        "--raise_exceptions=true",
                    ];
                    await host.addNewShellTask("Create HeatWave Cluster", shellArgs, undefined, false);
                    await vscode_1.commands.executeCommand("msg.mds.refreshOciProfiles");
                }
                else {
                    if (dbSystem.heatWaveCluster && clusterSize === dbSystem.heatWaveCluster.clusterSize
                        && shapeName === dbSystem.heatWaveCluster.shapeName) {
                        vscode_1.window.setStatusBarMessage("The HeatWave Cluster parameters remained unchanged.", 6000);
                    }
                    else {
                        const shellArgs = [
                            "--",
                            "mds",
                            "update",
                            "heat-wave-cluster",
                            `--db_system_id=${dbSystem.id.toString()}`,
                            `--cluster_size=${clusterSize.toString()}`,
                            `--shape_name=${shapeName}`,
                            `--config_profile=${profile.profile.toString()}`,
                            "--await_completion=true",
                            "--raise_exceptions=true",
                        ];
                        await host.addNewShellTask("Rescale HeatWave Cluster", shellArgs, undefined, false);
                        await vscode_1.commands.executeCommand("msg.mds.refreshOciProfiles");
                    }
                }
            }
        }
        catch (reason) {
            statusbarItem.hide();
            await vscode_1.window.showErrorMessage(`Error while listing MySQL REST services: ${String(reason)}`);
        }
    }
    async showMdsHWLoadDataDialog(connectionId, selectedSchemas, allSchemas, host) {
        const title = "Load Data to HeatWave";
        const request = {
            id: "mdsHWLoadDataDialog",
            type: Types_1.MdsDialogType.MdsHeatWaveLoadData,
            title,
            parameters: {},
            values: {
                selectedSchemas,
                allSchemas,
            },
        };
        const response = await this.dialogManager.showDialog(request, title);
        if (!response || response.closure !== Types_1.DialogResponseClosure.Accept) {
            return;
        }
        if (response.data) {
            const schemaList = response.data.schemas;
            const mode = response.data.mode;
            const output = response.data.output;
            const disableUnsupportedColumns = response.data.disableUnsupportedColumns;
            const optimizeLoadParallelism = response.data.optimizeLoadParallelism;
            const enableMemoryCheck = response.data.enableMemoryCheck;
            const sqlMode = response.data.sqlMode;
            const excludeList = response.data.excludeList;
            const shellArgs = [
                "--",
                "mds",
                "util",
                "heat-wave-load-data",
                `--schemas=${schemaList.join(",")}`,
                `--mode=${mode}`,
                `--output=${output}`,
                `--disable-unsupported-columns=${disableUnsupportedColumns ? "1" : "0"}`,
                `--optimize-load-parallelism=${optimizeLoadParallelism ? "1" : "0"}`,
                `--enable-memory-check=${enableMemoryCheck ? "1" : "0"}`,
                `--sql-mode="${sqlMode}"`,
                `--exclude-list=${excludeList}`,
                "--raise-exceptions=1",
                "--interactive=1",
            ];
            await host.addNewShellTask("Load Data to HeatWave Cluster", shellArgs, connectionId);
            await vscode_1.window.showInformationMessage("The data load to the HeatWave cluster operation has finished.");
        }
    }
    async showMdsEndpointDialog(dbSystem, compartment, profile, host) {
        const statusbarItem = vscode_1.window.createStatusBarItem();
        statusbarItem.text = `$(loading~spin) Fetching List of Compute Shapes...`;
        statusbarItem.show();
        try {
            const shapes = await this.shellSession.mds.listComputeShapes(profile.profile, dbSystem.compartmentId);
            const shapeList = shapes.map((shape, _i, _a) => {
                return shape.shape;
            });
            statusbarItem.hide();
            const title = "MySQL Endpoint Configuration";
            const request = {
                id: "mdsEndpointDialog",
                type: Types_1.MdsDialogType.MdsEndpoint,
                title,
                parameters: { shapes: shapeList },
                values: {
                    instanceName: `${dbSystem?.displayName} Endpoint`,
                    shapeName: "VM.Standard.E4.Flex",
                    cpuCount: 1,
                    memorySize: 16,
                    mysqlUserName: "dba",
                },
            };
            const response = await this.dialogManager.showDialog(request, title);
            if (!response || response.closure !== Types_1.DialogResponseClosure.Accept) {
                return;
            }
            if (response.data) {
                const instanceName = response.data.instanceName;
                const shapeName = response.data.shapeName;
                const cpuCount = response.data.cpuCount;
                const memorySize = response.data.memorySize;
                const mysqlUserName = response.data.mysqlUserName;
                const mysqlUserPassword = response.data.mysqlUserPassword;
                const createDbConnection = response.data.createDbConnection;
                const publicIp = response.data.publicIp;
                const domainName = response.data.domainName;
                const sslCertificate = response.data.sslCertificate;
                const portForwarding = response.data.portForwarding;
                const mrs = response.data.mrs;
                const jwtSecret = response.data.jwtSecret;
                const shellArgs = [
                    "--",
                    "mds",
                    "util",
                    "create-endpoint",
                    `--db_system_id=${dbSystem.id}`,
                    `--config_profile=${profile.profile}`,
                    `--instance_name=${instanceName}`,
                    `--shape=${shapeName}`,
                    `--cpu_count=${cpuCount}`,
                    `--memory_size=${memorySize}`,
                    `--mysql_user_name="${mysqlUserName}"`,
                    `--public_ip=${publicIp ? "true" : "false"}`,
                    `--port_forwarding=${portForwarding ? "true" : "false"}`,
                    `--mrs=${mrs ? "true" : "false"}`,
                    `--domain_name=${domainName}`,
                    `--ssl_cert=${sslCertificate ? "true" : "false"}`,
                    "--raise_exceptions=true",
                ];
                if (jwtSecret !== "") {
                    shellArgs.push(`--jwt_secret="${jwtSecret}"`);
                }
                await host.addNewShellTask("Create new Router Endpoint", shellArgs, undefined, true, [mysqlUserPassword]);
                await vscode_1.commands.executeCommand("msg.mds.refreshOciProfiles");
                if (createDbConnection) {
                    const details = {
                        id: 0,
                        dbType: ShellInterface_2.DBType.MySQL,
                        caption: instanceName,
                        description: "MySQL Router Connection",
                        useSSH: false,
                        useMDS: false,
                        options: {
                            "scheme": MySQL_1.MySQLConnectionScheme.MySQL,
                            "host": domainName ?? publicIp,
                            "port": 6446,
                            "user": mysqlUserName,
                            "schema": "",
                            "ssl-mode": undefined,
                            "compression": MySQL_1.MySQLConnCompression.Preferred,
                        },
                    };
                    ShellInterface_1.ShellInterface.dbConnections.addDbConnection(WebSession_1.webSession.currentProfileId, details, "").then((connectionId) => {
                        if (connectionId !== undefined) {
                            void Requisitions_1.requisitions.broadcastRequest(undefined, "refreshConnections", undefined);
                        }
                    }).catch((event) => {
                        void vscode_1.window.showErrorMessage(`Error while adding the DB Connection: ${String(event.message)}`);
                    });
                }
            }
        }
        catch (reason) {
            statusbarItem.hide();
            await vscode_1.window.showErrorMessage(`Error while listing Compute Shapes: ${String(reason)}`);
        }
    }
    isPortForwardingData(candidate) {
        return candidate.targetResourcePrivateIpAddress !== undefined;
    }
}
exports.MDSCommandHandler = MDSCommandHandler;
//# sourceMappingURL=MDSCommandHandler.js.map