import { ShellInterfaceCore } from "./ShellInterfaceCore";
import { ShellInterfaceDbConnection } from "./ShellInterfaceDbConnection";
import { ShellInterfaceModule } from "./ShellInterfaceModule";
import { ShellInterfaceUser } from "./ShellInterfaceUser";
export declare class ShellInterface {
    private static interfaces;
    static get core(): ShellInterfaceCore;
    static get users(): ShellInterfaceUser;
    static get modules(): ShellInterfaceModule;
    static get dbConnections(): ShellInterfaceDbConnection;
}
