import { CharStream, Lexer, Token } from "antlr4ng";
export declare abstract class PythonLexerBase extends Lexer {
    static tabSize: number;
    private opened;
    private indents;
    private buffer;
    private lastToken?;
    constructor(input: CharStream);
    emit(token?: Token): Token;
    nextToken(): Token;
    emitToken(token: Token): void;
    emitToken(tokenType: number, channel?: number, text?: string): void;
    protected handleNewLine(): void;
    protected handleSpaces(): void;
    protected incIndentLevel(): void;
    protected decIndentLevel(): void;
    private isNotNewLineOrComment;
    private processNewLine;
}
