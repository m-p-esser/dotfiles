import { IShellProfile } from "../../communication/ProtocolGui";
export declare class ShellInterfaceUser {
    authenticate(username: string, password: string): Promise<IShellProfile | undefined>;
    createUser(username: string, password: string, role?: string, allowedHosts?: string): Promise<void>;
    getDefaultProfile(userId: number): Promise<IShellProfile | undefined>;
    setDefaultProfile(userId: number, profileId: number): Promise<void>;
    getGuiModuleList(userId: number): Promise<string[]>;
    getProfile(profileId: number): Promise<IShellProfile | undefined>;
    addProfile(profile: IShellProfile): Promise<number | undefined>;
    updateProfile(profile: IShellProfile): Promise<IShellProfile | undefined>;
    deleteProfile(profile: IShellProfile): Promise<void>;
    grantRole(username: string, role: string): Promise<void>;
    listProfiles(userId: number): Promise<Array<{
        id: number;
        name: string;
    }>>;
    listRolePrivileges(role: string): Promise<void>;
    listRoles(): Promise<void>;
    listUserPrivileges(username: string): Promise<void>;
    listUserRoles(username: string): Promise<void>;
    listUsers(): Promise<void>;
    setCurrentProfile(profileId: number): Promise<void>;
    storePassword(url: string, password: string): Promise<void>;
    clearPassword(url: string): Promise<void>;
    listCredentials(): Promise<void>;
}
