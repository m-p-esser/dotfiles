import { ExtensionContext, OutputChannel, StatusBarItem } from "vscode";
export declare let taskOutputChannel: OutputChannel;
export declare let statusBarItem: StatusBarItem;
export declare const printChannelOutput: (content: string, reveal?: boolean) => void;
export declare const activate: (context: ExtensionContext) => void;
export declare const deactivate: () => void;
export declare const showStatusText: (text: string) => void;
