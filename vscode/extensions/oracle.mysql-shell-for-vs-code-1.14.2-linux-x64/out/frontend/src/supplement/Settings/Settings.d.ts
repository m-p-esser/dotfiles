import { ValueType } from "..";
export declare class Settings {
    private static dirty;
    private static values;
    private static saveTimer;
    private constructor();
    static saveSettings(force?: boolean): void;
    static get<T>(key: string, defaultValue: T): ValueType<T>;
    static get(key: string): unknown;
    static set(key: string, value: unknown): void;
    private static objectForKey;
    private static validatePath;
    private static mergeProfileValues;
    private static applicationWillFinish;
    private static restartAutoSaveTimeout;
}
