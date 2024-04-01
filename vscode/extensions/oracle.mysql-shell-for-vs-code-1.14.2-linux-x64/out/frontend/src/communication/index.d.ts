import { IDictionary } from "../app-logic/Types";
export * from "./Oci";
export declare type IEmbeddedSourceType = "app" | "host";
export interface IEmbeddedMessage {
    source: IEmbeddedSourceType;
    command: string;
    data?: IDictionary;
}
