import { ExtensionContext, TextEditor } from "vscode";
export declare class CodeBlocks {
    private static nextSpanId;
    private blockDecorationType;
    private codeBlocks;
    setup(context: ExtensionContext): void;
    executeSqlFromEditor(editor: TextEditor, caption: string, connectionId: number): void;
    private initializeBlockDecorations;
    private codeBlocksUpdate;
    private determinePythonQuotes;
    private beautifyQuery;
    private updateCodeDecorations;
    private spansOverlap;
    private checkAndApplyCodeBlockChanges;
    private proxyRequest;
}
