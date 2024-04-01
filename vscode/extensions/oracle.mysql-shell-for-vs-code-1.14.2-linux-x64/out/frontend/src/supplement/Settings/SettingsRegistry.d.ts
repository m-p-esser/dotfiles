import { IRequestTypeMap } from "../Requisitions";
declare type SettingValueType = "string" | "boolean" | "number" | "list" | "choice" | "object" | "action";
interface ISettingParameters {
    members?: string[];
    choices?: Array<[string, string, string]>;
    range?: [number, number];
    action?: keyof IRequestTypeMap;
}
export interface ISettingValue {
    id: string;
    title: string;
    key: string;
    description: string;
    valueType: SettingValueType;
    defaultValue: unknown;
    advanced: boolean;
    parameters: ISettingParameters;
}
export interface ISettingCategory {
    id: string;
    title: string;
    key: string;
    description: string;
    values: ISettingValue[];
    children?: ISettingCategory[];
}
export declare const settingCategories: ISettingCategory;
export declare const categoryFromPath: (path: string) => [string, ISettingCategory];
export declare const registerSettings: () => void;
export {};
