"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFormatter = void 0;
const json_formatter_1 = require("./json-formatter");
function createFormatter() {
    return new json_formatter_1.JsonFormatter;
}
exports.createFormatter = createFormatter;
//# sourceMappingURL=formatter-factory.js.map