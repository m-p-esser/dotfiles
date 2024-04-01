"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Protocol = exports.ShellPromptResponseType = exports.EventType = void 0;
var EventType;
(function (EventType) {
    EventType[EventType["Request"] = -1] = "Request";
    EventType[EventType["ErrorResponse"] = -2] = "ErrorResponse";
    EventType[EventType["StartResponse"] = 1] = "StartResponse";
    EventType[EventType["DataResponse"] = 2] = "DataResponse";
    EventType[EventType["FinalResponse"] = 3] = "FinalResponse";
    EventType[EventType["DoneResponse"] = 4] = "DoneResponse";
    EventType[EventType["Notification"] = 4] = "Notification";
    EventType[EventType["Unknown"] = 0] = "Unknown";
})(EventType = exports.EventType || (exports.EventType = {}));
var ShellPromptResponseType;
(function (ShellPromptResponseType) {
    ShellPromptResponseType["Ok"] = "OK";
    ShellPromptResponseType["Cancel"] = "CANCEL";
})(ShellPromptResponseType = exports.ShellPromptResponseType || (exports.ShellPromptResponseType = {}));
var Protocol;
(function (Protocol) {
    Protocol["UserAuthenticate"] = "authenticate";
    Protocol["PromptReply"] = "prompt_reply";
})(Protocol = exports.Protocol || (exports.Protocol = {}));
//# sourceMappingURL=Protocol.js.map