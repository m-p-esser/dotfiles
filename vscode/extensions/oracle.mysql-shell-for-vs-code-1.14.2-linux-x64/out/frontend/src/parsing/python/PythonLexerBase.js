"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonLexerBase = void 0;
const antlr4ng_1 = require("antlr4ng");
const PythonLexer_1 = require("./generated/PythonLexer");
class PythonLexerBase extends antlr4ng_1.Lexer {
    static tabSize = 8;
    opened = 0;
    indents = [];
    buffer = [];
    lastToken;
    constructor(input) {
        super(input);
    }
    emit(token) {
        if (!token) {
            return super.emit();
        }
        super._token = token;
        this.buffer.push(token);
        this.lastToken = token;
        return token;
    }
    nextToken() {
        if (this.inputStream.LA(1) === PythonLexer_1.PythonLexer.EOF && this.indents.length > 0) {
            const token = this.buffer[this.buffer.length - 1];
            if (!token || token.type !== PythonLexer_1.PythonLexer.LINE_BREAK) {
                this.emitToken(PythonLexer_1.PythonLexer.LINE_BREAK);
            }
            while (this.indents.length !== 0) {
                this.emitToken(PythonLexer_1.PythonLexer.DEDENT);
                this.indents.pop();
            }
        }
        const candidate = this.buffer.shift();
        if (candidate) {
            return candidate;
        }
        return super.nextToken();
    }
    emitToken(tokenOrTokenType, channel, text) {
        if (tokenOrTokenType instanceof antlr4ng_1.Token) {
            this.emit(tokenOrTokenType);
            return;
        }
        channel = channel ?? PythonLexerBase.DEFAULT_TOKEN_CHANNEL;
        text = text ?? "";
        const charIndex = this._tokenStartCharIndex;
        const token = new antlr4ng_1.CommonToken(this._tokenFactorySourcePair, tokenOrTokenType, channel, charIndex - text.length, charIndex);
        token.text = text;
        token.line = this.line;
        if (tokenOrTokenType !== PythonLexer_1.PythonLexer.NEWLINE) {
            token.column = this.column - text.length;
        }
        this.emit(token);
    }
    handleNewLine() {
        this.emitToken(PythonLexer_1.PythonLexer.NEWLINE, PythonLexerBase.HIDDEN, this.text);
        const next = String.fromCharCode(this.inputStream.LA(1));
        if (next !== " " && next !== "\t" && this.isNotNewLineOrComment(next)) {
            this.processNewLine(0);
        }
    }
    handleSpaces() {
        const next = String.fromCharCode(this.inputStream.LA(1));
        if ((!this.lastToken || this.lastToken.type === PythonLexer_1.PythonLexer.NEWLINE)
            && this.isNotNewLineOrComment(next)) {
            let indent = 0;
            const text = this.text;
            for (let i = 0; i < text.length; ++i) {
                indent += text.charAt(i) === "\t" ? PythonLexerBase.tabSize - indent % PythonLexerBase.tabSize : 1;
            }
            this.processNewLine(indent);
        }
        this.emitToken(PythonLexer_1.PythonLexer.WS, PythonLexerBase.HIDDEN, this.text);
    }
    incIndentLevel() {
        this.opened++;
    }
    decIndentLevel() {
        if (this.opened > 0) {
            --this.opened;
        }
    }
    isNotNewLineOrComment(next) {
        return this.opened === 0 && next !== "\r" && next !== "\n" && next !== "\f" && next !== "#";
    }
    processNewLine(indent) {
        this.emitToken(PythonLexer_1.PythonLexer.LINE_BREAK);
        const previous = this.indents.length === 0 ? 0 : this.indents[0];
        if (indent > previous) {
            this.indents.push(indent);
            this.emitToken(PythonLexer_1.PythonLexer.INDENT);
        }
        else {
            while (this.indents.length !== 0 && this.indents[0] > indent) {
                this.emitToken(PythonLexer_1.PythonLexer.DEDENT);
                this.indents.pop();
            }
        }
    }
}
exports.PythonLexerBase = PythonLexerBase;
//# sourceMappingURL=PythonLexerBase.js.map