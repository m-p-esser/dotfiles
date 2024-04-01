export declare enum MySQLConnectionScheme {
    MySQL = "mysql",
    MySQLx = "mysqlx"
}
export declare enum MySQLSslMode {
    Disabled = "DISABLED",
    Preferred = "PREFERRED",
    Required = "REQUIRED",
    VerifyCA = "VERIFY_CA",
    VerifyIdentity = "VERIFY_IDENTITY"
}
export declare enum MySQLAuthMethod {
    Auto = "AUTO",
    FromCapabilities = "FROM_CAPABILITIES",
    Fallback = "FALLBACK",
    MySQL41 = "MYSQL41",
    Plain = "PLAIN",
    SHA256 = "SHA256_MEMORY"
}
export declare enum MySQLSqlMode {
    Ansi = "ANSI",
    Traditional = "TRADITIONAL",
    AllowInvalidDates = "ALLOW_INVALID_DATES",
    AnsiQuotes = "ANSI_QUOTES",
    ErrorForDivisionByZero = "ERROR_FOR_DIVISION_BY_ZERO",
    HighNotPrecedence = "HIGH_NOT_PRECEDENCE",
    IgnoreSpace = "IGNORE_SPACE",
    NoAutoValueOnZero = "NO_AUTO_VALUE_ON_ZERO",
    NoUnsignedSubtraction = "NO_UNSIGNED_SUBTRACTION",
    NoZeroDate = "NO_ZERO_DATE",
    NoZeroInDate = "NO_ZERO_IN_DATE",
    OnlyFullGroupBy = "ONLY_FULL_GROUP_BY",
    PadCharToFullLength = "PAD_CHAR_TO_FULL_LENGTH",
    PipesAsConcat = "PIPES_AS_CONCAT",
    RealAsFloat = "REAL_AS_FLOAT",
    StrictAllTables = "STRICT_ALL_TABLES",
    StrictTransTables = "STRICT_TRANS_TABLES",
    TimeTruncateFractional = "TIME_TRUNCATE_FRACTIONAL"
}
export declare enum MySQLConnCompression {
    Required = "REQUIRED",
    Preferred = "PREFERRED",
    Disabled = "DISABLED"
}
export interface IMySQLConnectionOptions {
    scheme: MySQLConnectionScheme;
    user?: string;
    password?: string;
    host: string;
    port?: number;
    socket?: string;
    schema?: string;
    "sql-mode"?: MySQLSqlMode[];
    "ssl-mode"?: MySQLSslMode;
    "ssl-ca"?: string;
    "ssl-capath"?: string;
    "ssl-cert"?: string;
    "ssl-key"?: string;
    "ssl-crl"?: string;
    "ssl-crlpath"?: string;
    "ssl-ciphersuites"?: string;
    "ssl-cipher"?: string;
    "tls-version"?: string;
    "tls-ciphers"?: string;
    "auth-method"?: MySQLAuthMethod;
    "get-server-public-key"?: boolean;
    "server-public-key-path"?: string;
    "connect-timeout"?: number;
    compression?: MySQLConnCompression;
    "compression-algorithms"?: string;
    "compression-level"?: number;
    "connection-attributes"?: {
        [key: string]: string;
    };
    "local-infile"?: boolean;
    "ssh"?: string;
    "ssh-password"?: string;
    "ssh-identity-file"?: string;
    "ssh-identity-file-password"?: string;
    "ssh-config-file"?: string;
    "ssh-public-identity-file"?: string;
    "mysql-db-system-id"?: string;
    "profile-name"?: string;
    "bastion-id"?: string;
    "disable-heat-wave-check"?: boolean;
}
