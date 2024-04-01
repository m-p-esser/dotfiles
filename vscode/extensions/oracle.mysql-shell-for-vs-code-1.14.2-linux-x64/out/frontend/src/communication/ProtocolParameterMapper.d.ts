/// <reference path="../../../../../frontend/src/components/CommunicationDebugger/debugger-runtime.d.ts" />
import { Protocol, ShellPromptResponseType } from "./Protocol";
import { IProtocolGuiParameters } from "./ProtocolGui";
import { IProtocolMdsParameters } from "./ProtocolMds";
import { IProtocolMrsParameters } from "./ProtocolMrs";
export interface IProtocolParameters extends IProtocolGuiParameters, IProtocolMdsParameters, IProtocolMrsParameters {
    "native": INativeShellRequest;
    [Protocol.UserAuthenticate]: {
        username: string;
        password: string;
    };
    [Protocol.PromptReply]: {
        requestId: string;
        type: ShellPromptResponseType;
        reply: string;
        moduleSessionId: string;
    };
}
