export declare type ShellDictionaryType = string | number | boolean | undefined | unknown | null | IShellDictionary;
export interface IShellDictionary {
    [key: string]: ShellDictionaryType | ShellDictionaryType[];
}
export declare enum EventType {
    Request = -1,
    ErrorResponse = -2,
    StartResponse = 1,
    DataResponse = 2,
    FinalResponse = 3,
    DoneResponse = 4,
    Notification = 4,
    Unknown = 0
}
export declare enum ShellPromptResponseType {
    Ok = "OK",
    Cancel = "CANCEL"
}
export interface IRequestState {
    type: string;
    msg: string;
}
export interface IGenericResponse {
    requestId: string;
    requestState: IRequestState;
    eventType: EventType;
    done?: boolean;
}
export declare enum Protocol {
    UserAuthenticate = "authenticate",
    PromptReply = "prompt_reply"
}
export interface IPromptReplyBackend {
    sendReply: (requestId: string, type: ShellPromptResponseType, reply: string, moduleSessionId?: string) => Promise<void>;
}
