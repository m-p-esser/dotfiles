import { Command, TreeItem } from "vscode";
import { ShellTask } from "../../../../frontend/src/shell-tasks/ShellTask";
export declare class ShellTaskTreeItem extends TreeItem {
    task: ShellTask;
    contextValue: string;
    constructor(task: ShellTask, command?: Command);
    private static percentage;
}
