import { IShellProfile } from "../communication/ProtocolGui";
declare class WebSession {
    localUserMode: boolean;
    private cookies;
    private shellProfile;
    private sessionData;
    private constructor();
    static get instance(): WebSession;
    get userId(): number;
    set userId(userId: number);
    get userName(): string;
    set userName(name: string);
    get profile(): IShellProfile;
    set profile(newProfile: IShellProfile);
    get currentProfileId(): number;
    get sessionId(): string | undefined;
    set sessionId(id: string | undefined);
    clearSessionData(): void;
    moduleSessionId(moduleName: string): string | undefined;
    setModuleSessionId(moduleName: string, sessionId?: string): void;
    loadProfile(newProfile: IShellProfile): void;
    saveProfile(): void;
    private writeSessionData;
}
export declare const webSession: WebSession;
export {};
