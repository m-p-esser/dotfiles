"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeBlocks = void 0;
const path_1 = __importDefault(require("path"));
const vscode_1 = require("vscode");
const antlr4ng_1 = require("antlr4ng");
const PythonLexer_1 = require("../../frontend/src/parsing/python/generated/PythonLexer");
const Requisitions_1 = require("../../frontend/src/supplement/Requisitions");
const extension_1 = require("./extension");
class CodeBlocks {
    static nextSpanId = 1;
    blockDecorationType;
    codeBlocks = new Map();
    setup(context) {
        this.initializeBlockDecorations();
        Requisitions_1.requisitions.register("proxyRequest", this.proxyRequest);
        context.subscriptions.push(vscode_1.workspace.onDidCloseTextDocument((document) => {
            if (document.uri.scheme === "file") {
                this.codeBlocks.delete(document.uri);
            }
        }));
        context.subscriptions.push(vscode_1.window.onDidChangeActiveTextEditor((editor) => {
            if (editor && this.codeBlocks.has(editor.document.uri)) {
                this.updateCodeDecorations(editor.document);
            }
        }));
        context.subscriptions.push(vscode_1.workspace.onDidChangeTextDocument((event) => {
            const spans = this.codeBlocks.get(event.document.uri);
            if (spans) {
                event.contentChanges.forEach((change) => {
                    const changeLength = change.text.length - change.rangeLength;
                    let startIndex = -1;
                    let count = 0;
                    spans.forEach((current, index) => {
                        if (this.spansOverlap(current.start, current.length, change.rangeOffset, changeLength)) {
                            if (startIndex === -1) {
                                startIndex = index;
                            }
                            ++count;
                        }
                    });
                    let needUpdate = false;
                    if (count > 0) {
                        const startSpan = spans[startIndex];
                        if (count > 1 || change.rangeOffset < startSpan.start
                            || change.rangeOffset + change.rangeLength > startSpan.start + startSpan.length) {
                            spans.splice(startIndex--, count);
                            needUpdate = true;
                        }
                        else {
                            spans[startIndex].length -= changeLength;
                        }
                    }
                    for (let i = startIndex + 1; i < spans.length; ++i) {
                        spans[i].start -= changeLength;
                    }
                    if (needUpdate) {
                        this.updateCodeDecorations(event.document);
                    }
                });
            }
        }));
    }
    executeSqlFromEditor(editor, caption, connectionId) {
        const content = editor.document.getText();
        const { line, character } = editor.selection.active;
        const input = antlr4ng_1.CharStreams.fromString(content);
        let lexer;
        let stringType;
        switch (editor.document.languageId) {
            case "python": {
                lexer = new PythonLexer_1.PythonLexer(input);
                stringType = PythonLexer_1.PythonLexer.STRING;
                break;
            }
            case "javascript":
            case "typescript": {
                return;
            }
            default: {
                return;
            }
        }
        const tokenStream = new antlr4ng_1.CommonTokenStream(lexer);
        try {
            tokenStream.fill();
            const tokens = tokenStream.getTokens();
            let index = 0;
            while (index < tokens.length) {
                let token = tokens[index];
                const tokenLine = token.line - 1;
                if (tokenLine > line || (tokenLine === line && token.column > character)) {
                    if (index > 0) {
                        token = tokens[index - 1];
                        if (token.line - 1 < line || token.column <= character) {
                            if (token.type === stringType && token.text) {
                                const [prefix, postfix] = this.determinePythonQuotes(token.text);
                                const sql = token.text.substring(prefix, token.text.length - postfix);
                                const [beautified, whiteSpaces] = this.beautifyQuery(sql);
                                const span = {
                                    id: CodeBlocks.nextSpanId++,
                                    originalCode: sql,
                                    whiteSpaces,
                                    start: token.start + prefix,
                                    length: token.stop + 1 - postfix - (token.start + prefix),
                                };
                                let ranges = this.codeBlocks.get(editor.document.uri);
                                if (!ranges) {
                                    ranges = [];
                                    this.codeBlocks.set(editor.document.uri, ranges);
                                }
                                const existing = ranges.findIndex((candidate) => {
                                    return candidate.start === span.start;
                                });
                                if (existing === -1) {
                                    ranges.push(span);
                                    ranges.sort((lhs, rhs) => {
                                        return lhs.start - rhs.start;
                                    });
                                    this.updateCodeDecorations(editor.document);
                                }
                                else {
                                    ranges[existing] = span;
                                }
                                const data = {
                                    caption,
                                    connectionId: String(connectionId),
                                };
                                void Requisitions_1.requisitions.execute("editorRunQuery", {
                                    data,
                                    query: beautified,
                                    linkId: span.id,
                                    parameters: [],
                                });
                            }
                            break;
                        }
                    }
                }
                ++index;
            }
        }
        catch (reason) {
            (0, extension_1.printChannelOutput)(String(reason));
        }
    }
    initializeBlockDecorations() {
        this.blockDecorationType = vscode_1.window.createTextEditorDecorationType({
            isWholeLine: false,
            rangeBehavior: vscode_1.DecorationRangeBehavior.OpenOpen,
            overviewRulerLane: vscode_1.OverviewRulerLane.Left,
            light: {
                backgroundColor: "#db8f0015",
                overviewRulerColor: "#db8f00",
                gutterIconPath: path_1.default.join(__dirname, "..", "images", "light", "query-marker.svg"),
                before: {
                    contentIconPath: path_1.default.join(__dirname, "..", "images", "light", "sqlBlockStart.svg"),
                    width: "24px",
                    height: "14px",
                    margin: "0px 6px 0px 6px",
                    color: "#db8f00",
                },
                after: {
                    contentIconPath: path_1.default.join(__dirname, "..", "images", "light", "sqlBlockEnd.svg"),
                    width: "24px",
                    height: "14px",
                    margin: "0px 6px 0px 6px",
                    color: "#db8f00",
                },
            },
            dark: {
                backgroundColor: "#db8f0015",
                overviewRulerColor: "#db8f00",
                gutterIconPath: path_1.default.join(__dirname, "..", "images", "dark", "query-marker.svg"),
                before: {
                    contentIconPath: path_1.default.join(__dirname, "..", "images", "dark", "sqlBlockStart.svg"),
                    width: "24px",
                    height: "14px",
                    margin: "0px 6px 0px 6px",
                    color: "#db8f00",
                },
                after: {
                    contentIconPath: path_1.default.join(__dirname, "..", "images", "dark", "sqlBlockEnd.svg"),
                    width: "24px",
                    height: "14px",
                    margin: "0px 6px 0px 6px",
                    color: "#db8f00",
                },
            },
        });
    }
    codeBlocksUpdate = (data) => {
        let entry;
        let documentUri;
        this.codeBlocks.forEach((blocks, uri) => {
            blocks.forEach((block) => {
                if (block.id === data.linkId) {
                    entry = block;
                    documentUri = uri;
                }
            });
        });
        if (entry && documentUri) {
            if (vscode_1.window.activeTextEditor?.document.uri !== documentUri) {
                const options = {
                    viewColumn: vscode_1.ViewColumn.One,
                    preserveFocus: true,
                };
                void vscode_1.window.showTextDocument(documentUri, options).then((editor) => {
                    this.checkAndApplyCodeBlockChanges(editor, data.code, entry);
                });
            }
            else {
                this.checkAndApplyCodeBlockChanges(vscode_1.window.activeTextEditor, data.code, entry);
            }
        }
        else {
            void vscode_1.window.showInformationMessage("The original code block no longer exists and cannot be updated.");
        }
        return Promise.resolve(true);
    };
    determinePythonQuotes(text) {
        const match = text.match(/^(u|br?|r(f|b)?|fr?)?(["']{1,3})/i);
        if (match) {
            const prefixLength = match[0].length;
            const postfixLength = prefixLength - (match[1] ?? "").length;
            return [prefixLength, postfixLength];
        }
        return [0, 0];
    }
    beautifyQuery(text) {
        const whiteSpaces = {
            leading: "",
            indentation: "",
            trailing: "",
        };
        text = text.replace(/\t/g, "    ");
        const lines = text.split("\n");
        let count = 0;
        for (const line of lines) {
            if (line.trim().length === 0) {
                ++count;
                whiteSpaces.leading += line + "\n";
            }
            else {
                break;
            }
        }
        lines.splice(0, count);
        count = 0;
        for (const line of lines.reverse()) {
            if (line.trim().length === 0) {
                ++count;
                whiteSpaces.trailing += "\n" + line;
            }
            else {
                break;
            }
        }
        lines.splice(0, count);
        lines.reverse();
        if (lines.length > 0) {
            const match = lines[0].match(/(:?\s+).*/);
            whiteSpaces.indentation = match?.[1] ?? "";
            if (whiteSpaces.indentation) {
                lines.forEach((line, index) => {
                    if (line.startsWith(whiteSpaces.indentation)) {
                        lines[index] = line.substring(whiteSpaces.indentation.length);
                    }
                });
            }
        }
        return [lines.join("\n"), whiteSpaces];
    }
    updateCodeDecorations(document) {
        const blocks = this.codeBlocks.get(document.uri);
        if (blocks) {
            const ranges = blocks.map((block) => {
                const startPosition = document.positionAt(block.start);
                const endPosition = document.positionAt(block.start + block.length);
                return new vscode_1.Range(startPosition, endPosition);
            });
            vscode_1.window.activeTextEditor?.setDecorations(this.blockDecorationType, ranges);
        }
    }
    spansOverlap(start1, length1, start2, length2) {
        const end1 = start1 + length1;
        const end2 = start2 + length2;
        if (start1 <= start2) {
            return start2 <= end1;
        }
        return start1 <= end2;
    }
    checkAndApplyCodeBlockChanges(editor, newCode, block) {
        if (block) {
            const lines = newCode.split("\n").map((line) => {
                return line.trim().length === 0 ? "" : block.whiteSpaces.indentation + line;
            });
            newCode = block.whiteSpaces.leading + lines.join("\n") + block.whiteSpaces.trailing;
            const start = editor.document.positionAt(block.start);
            const end = editor.document.positionAt(block.start + block.length);
            const range = new vscode_1.Range(start, end);
            const currentText = editor.document.getText(range);
            if (currentText !== block.originalCode) {
                void vscode_1.window.showWarningMessage("The original code was changed meanwhile. Do you still want to update " +
                    "it with your application code?", "Update", "Cancel")
                    .then((input) => {
                    if (input === "Update") {
                        void editor.edit((builder) => {
                            builder.replace(range, newCode);
                        }).then((success) => {
                            if (!success) {
                                void vscode_1.window.showErrorMessage("The changes could not be applied.");
                            }
                            else {
                                block.originalCode = newCode;
                            }
                        });
                    }
                });
            }
            else {
                void editor.edit((builder) => {
                    builder.replace(range, newCode);
                }).then((success) => {
                    if (!success) {
                        void vscode_1.window.showErrorMessage("The changes could not be applied.");
                    }
                    else {
                        block.originalCode = newCode;
                    }
                });
            }
        }
    }
    proxyRequest = (request) => {
        switch (request.original.requestType) {
            case "codeBlocksUpdate": {
                const response = request.original.parameter;
                return this.codeBlocksUpdate(response);
            }
            default:
        }
        return Promise.resolve(false);
    };
}
exports.CodeBlocks = CodeBlocks;
//# sourceMappingURL=CodeBlocks.js.map