import { IErrorResult } from "./ProtocolGui";
export declare class ResponseError extends Error {
    info: IErrorResult;
    constructor(info: IErrorResult);
}
