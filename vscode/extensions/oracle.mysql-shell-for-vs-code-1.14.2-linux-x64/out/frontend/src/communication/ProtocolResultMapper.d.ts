/// <reference path="../../../../../frontend/src/components/CommunicationDebugger/debugger-runtime.d.ts" />
import { Protocol } from "./Protocol";
import { IProtocolGuiResults, IShellProfile } from "./ProtocolGui";
import { IProtocolMdsResults } from "./ProtocolMds";
import { IProtocolMrsResults } from "./ProtocolMrs";
export interface IProtocolResults extends IProtocolGuiResults, IProtocolMdsResults, IProtocolMrsResults {
    "native": INativeShellResponse;
    [Protocol.UserAuthenticate]: {
        activeProfile: IShellProfile;
    };
    [Protocol.PromptReply]: {};
}
