"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageScheduler = void 0;
const Requisitions_1 = require("../supplement/Requisitions");
const WebSession_1 = require("../supplement/WebSession");
const string_helpers_1 = require("../utilities/string-helpers");
const helpers_1 = require("../utilities/helpers");
const Protocol_1 = require("./Protocol");
const ProtocolGui_1 = require("./ProtocolGui");
const ResponseError_1 = require("./ResponseError");
class MessageScheduler {
    static instance;
    static multiResultList = ProtocolGui_1.multiResultAPIs;
    socket;
    debugging = false;
    disconnecting = false;
    reconnectTimer;
    reconnectTimeout = 1000;
    ongoingRequests = new Map();
    #traceEnabled = false;
    static get get() {
        if (!MessageScheduler.instance) {
            MessageScheduler.instance = this.createInstance();
        }
        return MessageScheduler.instance;
    }
    constructor() {
    }
    static createInstance() {
        return new MessageScheduler();
    }
    get isConnected() {
        if (this.socket) {
            return this.socket.readyState === this.socket.OPEN;
        }
        return false;
    }
    set inDebugCall(value) {
        this.debugging = value;
    }
    set traceEnabled(value) {
        this.#traceEnabled = value;
    }
    get traceEnabled() {
        return this.#traceEnabled;
    }
    connect(options) {
        this.disconnecting = false;
        if (this.socket && (this.socket.readyState === this.socket.OPEN ||
            this.socket.readyState === this.socket.CONNECTING)) {
            return Promise.resolve();
        }
        else {
            const target = new URL(options.url);
            target.protocol = options.url.protocol.replace("http", "ws");
            target.pathname = "ws1.ws";
            if (Requisitions_1.appParameters.inDevelopment) {
                target.port = "8000";
            }
            return new Promise((resolve, reject) => {
                const socket = this.createWebSocket(target, options);
                socket.addEventListener("close", this.onClose.bind(this, options));
                socket.addEventListener("message", this.onMessage);
                socket.addEventListener("open", this.onOpen.bind(this, resolve));
                socket.addEventListener("error", this.onError.bind(this, options, reject));
                this.socket = socket;
            });
        }
    }
    disconnect() {
        if (this.socket) {
            try {
                this.disconnecting = true;
                this.socket.close();
                delete this.socket;
                this.socket = undefined;
            }
            catch (e) {
                console.error("Internal error while closing websocket: " + String(e));
            }
        }
    }
    sendRequest(details, useExecute = true, caseConversionIgnores = []) {
        return this.constructAndSendRequest(useExecute, caseConversionIgnores, {
            ...details,
        });
    }
    sendRawRequest(details, callback) {
        details.request_id = details.request_id ?? (0, helpers_1.uuid)();
        return new Promise((resolve, reject) => {
            if (this.traceEnabled) {
                void Requisitions_1.requisitions.execute("debugger", { request: details });
            }
            const ongoingRequest = {
                protocolType: "native",
                result: [],
                resolve,
                reject,
                onData: callback,
            };
            this.ongoingRequests.set(details.request_id, ongoingRequest);
            this.socket?.send(JSON.stringify(details));
        });
    }
    createWebSocket(target, options) {
        return new WebSocket(target);
    }
    onMessage = (event) => {
        const response = this.convertDataToResponse(event.data);
        if (response) {
            if (this.isWebSessionData(response) && !this.debugging) {
                void Requisitions_1.requisitions.execute("webSessionStarted", response);
            }
            else if (response.requestId) {
                const record = this.ongoingRequests.get(response.requestId);
                if (record) {
                    const ongoing = record;
                    const data = response;
                    switch (response.eventType) {
                        case Protocol_1.EventType.DataResponse: {
                            if (this.isErrorInfo(response)) {
                                const index = response.result.info.indexOf("ERROR:");
                                if (index > -1) {
                                    const error = response.result.info.substring(index);
                                    this.ongoingRequests.delete(response.requestId);
                                    ongoing.reject(error);
                                    break;
                                }
                            }
                            if (ongoing.onData) {
                                ongoing.onData(data, response.requestId);
                            }
                            else {
                                ongoing.result.push(data);
                            }
                            break;
                        }
                        case Protocol_1.EventType.FinalResponse: {
                            this.ongoingRequests.delete(response.requestId);
                            if (MessageScheduler.multiResultList.includes(record.protocolType)) {
                                ongoing.result.push(data);
                                ongoing.resolve(ongoing.result);
                            }
                            else {
                                ongoing.resolve(data);
                            }
                            break;
                        }
                        case Protocol_1.EventType.DoneResponse: {
                            this.ongoingRequests.delete(response.requestId);
                            if (MessageScheduler.multiResultList.includes(record.protocolType) ||
                                ongoing.result.length === 0) {
                                ongoing.resolve(ongoing.result);
                            }
                            else {
                                ongoing.resolve(ongoing.result[0]);
                            }
                            break;
                        }
                        case Protocol_1.EventType.ErrorResponse: {
                            this.ongoingRequests.delete(response.requestId);
                            const result = data.result;
                            if (result && "requestState" in result) {
                                ongoing.reject(new ResponseError_1.ResponseError(result));
                            }
                            else {
                                ongoing.reject(new ResponseError_1.ResponseError(data));
                            }
                            break;
                        }
                        default:
                    }
                }
            }
        }
    };
    constructAndSendRequest(isExecuteRequest, caseConversionIgnores, details) {
        const requestId = details.requestId ?? (0, helpers_1.uuid)();
        return new Promise((resolve, reject) => {
            const record = {
                requestId,
                request: (isExecuteRequest ? "execute" : details.requestType),
                command: (isExecuteRequest ? details.requestType : undefined),
                ...details.parameters,
            };
            caseConversionIgnores = caseConversionIgnores.concat(["rows"]);
            const data = (0, string_helpers_1.convertCamelToSnakeCase)(record, { ignore: caseConversionIgnores });
            if (this.traceEnabled) {
                void Requisitions_1.requisitions.execute("debugger", { request: data });
            }
            const ongoingRequest = {
                protocolType: details.requestType,
                result: [],
                resolve,
                reject,
                onData: details.onData,
            };
            this.ongoingRequests.set(requestId, ongoingRequest);
            this.socket?.send(JSON.stringify(data));
        });
    }
    onOpen = (resolve) => {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        this.reconnectTimeout = 1000;
        void Requisitions_1.requisitions.execute("socketStateChanged", true).then(() => {
            resolve();
        });
    };
    onClose = (options) => {
        WebSession_1.webSession.clearSessionData();
        void Requisitions_1.requisitions.execute("socketStateChanged", false);
        if (!this.disconnecting && !this.debugging) {
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
            }
            this.reconnectTimer = setTimeout(() => {
                void this.connect(options);
            }, this.reconnectTimeout);
        }
    };
    onError = (options, reject, event) => {
        reject(JSON.stringify(event, undefined, 4));
        this.reconnectTimeout *= 2;
        if (this.reconnectTimer) {
            this.reconnectTimer = setTimeout(() => {
                void this.connect(options);
            }, this.reconnectTimeout);
        }
        void Requisitions_1.requisitions.execute("showError", [
            "Communication Error",
            `Could not establish a connection to the backend. Make sure you use valid user credentials and the MySQL ` +
                `Shell is running. Trying to reconnect in ${this.reconnectTimeout / 1000} seconds.`,
        ]);
    };
    convertDataToResponse = (data) => {
        if (!data || !(typeof data === "string")) {
            return undefined;
        }
        const responseObject = JSON.parse(data);
        if (this.traceEnabled) {
            void Requisitions_1.requisitions.execute("debugger", { response: responseObject });
        }
        const response = (0, string_helpers_1.convertSnakeToCamelCase)(responseObject, { ignore: ["rows"] });
        switch (response.requestState.type) {
            case "ERROR": {
                response.eventType = Protocol_1.EventType.ErrorResponse;
                break;
            }
            case "PENDING": {
                if (response.requestState.msg === "Execution started...") {
                    response.eventType = Protocol_1.EventType.StartResponse;
                }
                else {
                    response.eventType = Protocol_1.EventType.DataResponse;
                }
                break;
            }
            case "OK": {
                if (response.done) {
                    response.eventType = Protocol_1.EventType.DoneResponse;
                }
                else {
                    response.eventType = Protocol_1.EventType.FinalResponse;
                }
                break;
            }
            default: {
                response.eventType = Protocol_1.EventType.Unknown;
                break;
            }
        }
        return response;
    };
    isErrorInfo(response) {
        return response.result && response.result.info !== undefined;
    }
    isWebSessionData(response) {
        return response.sessionUuid !== undefined;
    }
}
exports.MessageScheduler = MessageScheduler;
//# sourceMappingURL=MessageScheduler.js.map