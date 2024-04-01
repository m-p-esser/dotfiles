import * as codicon from "../components/ui/Codicon";
export interface IDictionary {
    [key: string]: unknown;
}
export declare enum DBDataType {
    Unknown = 0,
    TinyInt = 1,
    SmallInt = 2,
    MediumInt = 3,
    Int = 4,
    Bigint = 5,
    UInteger = 6,
    Float = 7,
    Real = 8,
    Double = 9,
    Decimal = 10,
    Binary = 11,
    Varbinary = 12,
    Char = 13,
    Nchar = 14,
    Varchar = 15,
    Nvarchar = 16,
    String = 17,
    TinyText = 18,
    Text = 19,
    MediumText = 20,
    LongText = 21,
    TinyBlob = 22,
    Blob = 23,
    MediumBlob = 24,
    LongBlob = 25,
    DateTime = 26,
    DateTime_f = 27,
    Date = 28,
    Time = 29,
    Time_f = 30,
    Year = 31,
    Timestamp = 32,
    Timestamp_f = 33,
    Geometry = 34,
    Point = 35,
    LineString = 36,
    Polygon = 37,
    GeometryCollection = 38,
    MultiPoint = 39,
    MultiLineString = 40,
    MultiPolygon = 41,
    Numeric = 42,
    Json = 43,
    Bit = 44,
    Boolean = 45,
    Enum = 46,
    Set = 47
}
export declare enum ParameterFormatType {
    None = 0,
    One = 1,
    OneOrZero = 2,
    Two = 3,
    TwoOrOne = 4,
    TwoOrZero = 5,
    TwoOrOneOrZero = 6,
    List = 10
}
export declare const uriPattern: RegExp;
export interface IDBCharacterSet {
    collations: string[];
    defaultCollation: string;
    description: string;
}
export interface IDBDataTypeDetails {
    type: DBDataType;
    characterMaximumLength?: number;
    characterOctetLength?: number;
    dateTimePrecision?: number;
    flags?: string[];
    numericPrecision?: number;
    numericPrecisionRadix?: number;
    numericScale?: number;
    needsQuotes?: boolean;
    parameterFormatType?: ParameterFormatType;
    synonyms?: string[];
}
export interface IColumnInfo {
    title: string;
    field: string;
    dataType: IDBDataTypeDetails;
    width?: number;
    rightAlign?: boolean;
}
export declare enum MessageType {
    Error = 0,
    Warning = 1,
    Info = 2,
    Text = 3,
    Response = 4
}
export interface IExecutionInfo {
    type?: MessageType;
    text: string;
}
export declare enum DialogType {
    Prompt = 0,
    Confirm = 1,
    Select = 2
}
export declare enum MrsDialogType {
    MrsService = 10,
    MrsAuthenticationApp = 11,
    MrsUser = 12,
    MrsSchema = 13,
    MrsDbObject = 14,
    MrsContentSet = 15
}
export declare enum MdsDialogType {
    MdsHeatWaveCluster = 20,
    MdsHeatWaveLoadData = 21,
    MdsEndpoint = 22
}
export interface IDialogRequest extends IDictionary {
    type: DialogType | MrsDialogType | MdsDialogType;
    id: string;
    title?: string;
    description?: string[];
    parameters?: IDictionary;
    values?: IDictionary;
    data?: IDictionary;
}
export declare enum DialogResponseClosure {
    Accept = 0,
    Decline = 1,
    Alternative = 2,
    Cancel = 3
}
export interface IDialogResponse extends IDictionary {
    id: string;
    type: DialogType | MdsDialogType;
    closure: DialogResponseClosure;
    values?: IDictionary;
    data?: IDictionary;
}
export interface IStatusbarInfo {
    id: string;
    text?: string;
    tooltip?: string;
    icon?: string | codicon.Codicon;
    choices?: Array<{
        label: string;
        data: IDictionary;
    }>;
    visible?: boolean;
    standout?: boolean;
    hideAfter?: number;
}
export interface IServicePasswordRequest {
    requestId: string;
    caption?: string;
    description?: string[];
    service?: string;
    user?: string;
    payload?: IDictionary;
}
