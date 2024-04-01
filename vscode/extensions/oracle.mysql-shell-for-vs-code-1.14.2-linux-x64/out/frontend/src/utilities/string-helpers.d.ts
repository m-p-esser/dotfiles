export declare const quote: (text: string, quoteChar?: string) => string;
export declare const unquote: (text: string, quotes?: string) => string;
export declare const convertPropValue: (value?: number | string | undefined, numericUnit?: string) => string | undefined;
export declare const isWhitespaceOnly: (str: string) => boolean;
export declare const formatTime: (time?: number | undefined) => string;
export declare const formatBytes: (value: number) => string;
export declare const formatWithNumber: (text: string, value: number) => string;
export declare const formatBase64ToHex: (input: unknown, limit?: number | undefined) => string;
export declare const convertHexToBase64: (hex: string) => string;
export declare const filterInt: (value: string) => number;
export declare const snakeToCamelCase: (str: string) => string;
export declare const camelToSnakeCase: (str: string) => string;
export declare const convertCamelToTitleCase: (s: string) => string;
export declare const convertTitleToCamelCase: (s: string) => string;
export declare const convertToPascalCase: (str: string) => string;
export declare const pathToCamelCase: (str: string) => string;
export declare const basename: (path: string, extension?: string | undefined) => string;
interface IConversionOptions {
    ignore?: string[];
}
export declare const convertCamelToSnakeCase: (o: object, options?: IConversionOptions | undefined) => object;
export declare const convertSnakeToCamelCase: (o: object, options?: IConversionOptions | undefined) => object;
export declare const compareVersionStrings: (baseVersion: string, compareToVersion: string) => number;
export declare const formatTextBlock: (text: string, maxLineLength: number) => string;
export declare const splitTextToLines: (text: string) => string[];
export {};
