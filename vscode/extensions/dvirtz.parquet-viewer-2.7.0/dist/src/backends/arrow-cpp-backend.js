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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrowCppBackend = void 0;
const apache_arrow_1 = require("apache-arrow");
const arrow_backend_1 = require("./arrow-backend");
const stream_1 = require("stream");
class ArrowCppBackend extends arrow_backend_1.ArrowBackend {
    readParquet(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof (this.readParquet_) == 'undefined') {
                try {
                    const module = yield Promise.resolve().then(() => __importStar(require("parquet-reader")));
                    this.readParquet_ = module.readParquet;
                }
                catch (error) {
                    throw new Error(`cannot find prebuilt arrow module, either build the module or use another backend: ${error}`);
                }
            }
            const stream = new stream_1.PassThrough;
            this.readParquet_(path, stream);
            return apache_arrow_1.AsyncRecordBatchStreamReader.from(stream);
        });
    }
}
exports.ArrowCppBackend = ArrowCppBackend;
//# sourceMappingURL=arrow-cpp-backend.js.map