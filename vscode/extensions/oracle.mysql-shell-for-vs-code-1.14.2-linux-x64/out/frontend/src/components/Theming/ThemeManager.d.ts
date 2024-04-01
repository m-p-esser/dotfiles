interface IColors {
    [key: string]: string;
}
export interface ITokenEntry {
    name?: string;
    scope: string[] | string;
    settings: {
        foreground?: string;
        background?: string;
        fontStyle?: string;
    };
}
export interface IThemeObject {
    name: string;
    type?: string;
    include?: string;
    colors?: IColors;
    settings?: ITokenEntry[];
    tokenColors?: ITokenEntry[];
}
export interface IThemeChangeData {
    name: string;
    safeName: string;
    type: "dark" | "light";
    values: IThemeObject;
}
export declare class ThemeManager {
    private static instance;
    private themeDefinitions;
    private themeStyleElement?;
    private currentTheme;
    private safeThemeName;
    private updating;
    private constructor();
    static get get(): ThemeManager;
    get activeThemeValues(): IThemeObject | undefined;
    get activeThemeType(): "dark" | "light" | undefined;
    get installedThemes(): string[];
    get themeStyleNode(): CSSStyleDeclaration;
    get currentThemeAsText(): string;
    get activeThemeSafe(): string;
    get activeTheme(): string;
    set activeTheme(theme: string);
    getTokenForegroundColor(scope: string): string | undefined;
    saveTheme(): void;
    loadThemeDetails(values: IThemeObject, consolidate?: boolean): string;
    themeValueNameToCssVariable(name: string): string;
    duplicateCurrentTheme(newName: string): boolean;
    removeCurrentTheme(): void;
    private sendChangeNotification;
    private settingsChanged;
    private hostThemeChange;
    private handleOSThemeChange;
    private loadTheme;
    private storeThemeName;
    private uiColorSanityCheck;
    private tokenColorSanityCheck;
    private checkColor;
    private matchAndAssignDefault;
    private setDefaultValue;
    private iterateColorDescription;
    private updateSettings;
}
export {};
