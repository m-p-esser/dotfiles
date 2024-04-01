import { AdminSectionTreeItem } from "./AdminSectionTreeItem";
import { AdminTreeItem } from "./AdminTreeItem";
import { ConnectionTreeItem } from "./ConnectionTreeItem";
import { MrsAuthAppTreeItem } from "./MrsAuthAppTreeItem";
import { MrsContentFileTreeItem } from "./MrsContentFileTreeItem";
import { MrsContentSetTreeItem } from "./MrsContentSetTreeItem";
import { MrsDbObjectTreeItem } from "./MrsDbObjectTreeItem";
import { MrsRouterTreeItem } from "./MrsRouterTreeItem";
import { MrsSchemaTreeItem } from "./MrsSchemaTreeItem";
import { MrsServiceTreeItem } from "./MrsServiceTreeItem";
import { MrsTreeItem } from "./MrsTreeItem";
import { MrsUserTreeItem } from "./MrsUserTreeItem";
import { SchemaEventTreeItem } from "./SchemaEventTreeItem";
import { SchemaGroupTreeItem } from "./SchemaGroupTreeItem";
import { SchemaRoutineTreeItem } from "./SchemaRoutineTreeItem";
import { SchemaTableColumnTreeItem } from "./SchemaTableColumnTreeItem";
import { SchemaTableForeignKeyTreeItem } from "./SchemaTableForeignKeyTreeItem";
import { TableGroupTreeItem } from "./SchemaTableGroupTreeItem";
import { SchemaTableIndexTreeItem } from "./SchemaTableIndexTreeItem";
import { SchemaTableTreeItem } from "./SchemaTableTreeItem";
import { SchemaTableTriggerTreeItem } from "./SchemaTableTriggerTreeItem";
import { SchemaTreeItem } from "./SchemaTreeItem";
import { SchemaViewMySQLTreeItem } from "./SchemaViewMySQLTreeItem";
export interface ICdmRoutineEntry {
    parent: ICdmSchemaGroupEntry;
    type: "routine";
    treeItem: SchemaRoutineTreeItem;
}
export interface ICdmEventEntry {
    parent: ICdmSchemaGroupEntry;
    type: "event";
    treeItem: SchemaEventTreeItem;
}
export interface ICdmColumnEntry {
    parent: ICdmTableGroupEntry;
    type: "column";
    treeItem: SchemaTableColumnTreeItem;
}
export interface ICdmIndexEntry {
    parent: ICdmTableGroupEntry;
    type: "index";
    treeItem: SchemaTableIndexTreeItem;
}
export interface ICdmForeignKeyEntry {
    parent: ICdmTableGroupEntry;
    type: "foreignKey";
    treeItem: SchemaTableForeignKeyTreeItem;
}
export interface ICdmTriggerEntry {
    parent: ICdmTableGroupEntry;
    type: "trigger";
    treeItem: SchemaTableTriggerTreeItem;
}
export declare type CdmTableGroupMember = ICdmColumnEntry | ICdmIndexEntry | ICdmForeignKeyEntry | ICdmTriggerEntry;
export interface ICdmTableGroupEntry {
    parent: ICdmTableEntry;
    type: "tableMemberGroup";
    treeItem: TableGroupTreeItem;
    members: CdmTableGroupMember[];
}
export interface ICdmTableEntry {
    parent: ICdmSchemaGroupEntry;
    type: "table";
    treeItem: SchemaTableTreeItem;
    groups: ICdmTableGroupEntry[];
}
export interface ICdmViewEntry {
    parent: ICdmSchemaGroupEntry;
    type: "view";
    treeItem: SchemaViewMySQLTreeItem;
}
export declare type CdmSchemaGroupMember = ICdmRoutineEntry | ICdmEventEntry | ICdmTableEntry | ICdmViewEntry;
export interface ICdmSchemaGroupEntry {
    parent: ICdmSchemaEntry;
    type: "schemaMemberGroup";
    treeItem: SchemaGroupTreeItem;
    members: CdmSchemaGroupMember[];
}
export interface ICdmSchemaEntry {
    parent: ICdmConnectionEntry;
    type: "schema";
    treeItem: SchemaTreeItem;
    groups: ICdmSchemaGroupEntry[];
}
export interface ICdmAdminSectionEntry {
    parent: ICdmAdminEntry;
    type: "adminSection";
    treeItem: AdminSectionTreeItem;
}
interface ICdmAdminEntry {
    parent: ICdmConnectionEntry;
    type: "admin";
    treeItem: AdminTreeItem;
    sections: ICdmAdminSectionEntry[];
}
export interface ICdmRestDbObjectEntry {
    parent: ICdmRestSchemaEntry;
    type: "mrsDbObject";
    treeItem: MrsDbObjectTreeItem;
}
export interface ICdmRestSchemaEntry {
    parent: ICdmRestServiceEntry;
    type: "mrsSchema";
    treeItem: MrsSchemaTreeItem;
    dbObjects: ICdmRestDbObjectEntry[];
}
export interface ICdmRestContentFileEntry {
    parent: ICdmRestContentSetEntry;
    type: "mrsContentFile";
    treeItem: MrsContentFileTreeItem;
}
export interface ICdmRestContentSetEntry {
    parent: ICdmRestServiceEntry;
    type: "mrsContentSet";
    treeItem: MrsContentSetTreeItem;
    files: ICdmRestContentFileEntry[];
}
export interface ICdmRestUserEntry {
    parent: ICdmRestAuthAppEntry;
    type: "mrsUser";
    treeItem: MrsUserTreeItem;
}
export interface ICdmRestAuthAppEntry {
    parent: ICdmRestServiceEntry;
    type: "mrsAuthApp";
    treeItem: MrsAuthAppTreeItem;
    users: ICdmRestUserEntry[];
}
export interface ICdmRestServiceEntry {
    parent: ICdmRestRootEntry;
    type: "mrsService";
    treeItem: MrsServiceTreeItem;
    schemas: ICdmRestSchemaEntry[];
    contentSets: ICdmRestContentSetEntry[];
    authApps: ICdmRestAuthAppEntry[];
}
export interface ICdmRestRouterEntry {
    parent: ICdmRestRootEntry;
    type: "mrsRouter";
    treeItem: MrsRouterTreeItem;
}
export interface ICdmRestRootEntry {
    parent: ICdmConnectionEntry;
    type: "mrs";
    treeItem: MrsTreeItem;
    services: ICdmRestServiceEntry[];
    routers: ICdmRestRouterEntry[];
}
export interface ICdmConnectionEntry {
    type: "connection";
    id: number;
    treeItem: ConnectionTreeItem;
    isOpen: boolean;
    currentSchema: string;
    openEditors: number;
    mrsEntry?: ICdmRestRootEntry;
    adminEntry?: ICdmAdminEntry;
    schemaEntries: ICdmSchemaEntry[];
}
export declare type ConnectionsTreeDataModelEntry = ICdmConnectionEntry | ICdmSchemaEntry | ICdmSchemaGroupEntry | ICdmTableEntry | ICdmViewEntry | ICdmEventEntry | ICdmRoutineEntry | ICdmAdminEntry | ICdmAdminSectionEntry | ICdmTableGroupEntry | ICdmColumnEntry | ICdmIndexEntry | ICdmForeignKeyEntry | ICdmTriggerEntry | ICdmRestRootEntry | ICdmRestServiceEntry | ICdmRestRouterEntry | ICdmRestSchemaEntry | ICdmRestContentSetEntry | ICdmRestAuthAppEntry | ICdmRestUserEntry | ICdmRestContentFileEntry | ICdmRestDbObjectEntry;
export {};
