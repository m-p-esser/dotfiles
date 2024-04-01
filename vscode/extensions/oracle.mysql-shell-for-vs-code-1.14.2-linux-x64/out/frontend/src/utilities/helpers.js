"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardKeys = exports.deepMapArray = exports.deepMapKeys = exports.strictEval = exports.deepEqual = exports.deepClone = exports.flattenObject = exports.waitFor = exports.sleep = exports.binarySearch = exports.uuidBinary16Base64 = exports.uuid = exports.clampValue = exports.saveTextAsFile = exports.selectFile = void 0;
const string_helpers_1 = require("./string-helpers");
const selectFile = (acceptedExtensions, multiple) => {
    return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.id = "fileSelect";
        input.multiple = multiple;
        input.accept = acceptedExtensions.join(",");
        document.body.appendChild(input);
        input.onchange = () => {
            const files = input.files ? Array.from(input.files) : null;
            resolve(files);
            document.body.removeChild(input);
        };
        input.click();
    });
};
exports.selectFile = selectFile;
const saveTextAsFile = (text, fileName) => {
    const blob = new Blob([text], { type: "text/plain" });
    const downloadLink = document.createElement("a");
    downloadLink.download = fileName;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL) {
        downloadLink.href = window.webkitURL.createObjectURL(blob);
    }
    else {
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.onclick = (event) => {
            if (event.target) {
                document.body.removeChild(event.target);
            }
        };
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
    if (window.webkitURL) {
        window.webkitURL.revokeObjectURL(downloadLink.href);
    }
    else {
        window.URL.revokeObjectURL(downloadLink.href);
    }
};
exports.saveTextAsFile = saveTextAsFile;
const clampValue = (value, min, max) => {
    if (min != null && value < min) {
        return min;
    }
    if (max != null && value > max) {
        return max;
    }
    return value;
};
exports.clampValue = clampValue;
const uuid = () => {
    let d = new Date().getTime();
    let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        let r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        }
        else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === "x" ? r : ((r & 0x7) | 0x8)).toString(16);
    });
};
exports.uuid = uuid;
const uuidBinary16Base64 = () => {
    const id = (0, exports.uuid)().replaceAll("-", "");
    return (0, string_helpers_1.convertHexToBase64)(id);
};
exports.uuidBinary16Base64 = uuidBinary16Base64;
const binarySearch = (list, predicate) => {
    let m = 0;
    let n = list.length - 1;
    while (m <= n) {
        const k = (n + m) >> 1;
        const comparison = predicate(list[k]);
        if (comparison > 0) {
            m = k + 1;
        }
        else if (comparison < 0) {
            n = k - 1;
        }
        else {
            return k;
        }
    }
    return -m - 1;
};
exports.binarySearch = binarySearch;
const sleep = (ms) => {
    return new Promise((resolve) => {
        return setTimeout(resolve, ms);
    });
};
exports.sleep = sleep;
const waitFor = async (timeout, condition) => {
    while (!condition() && timeout > 0) {
        timeout -= 100;
        await (0, exports.sleep)(100);
    }
    return timeout > 0 ? true : false;
};
exports.waitFor = waitFor;
const flattenObject = (o) => {
    for (const [key, value] of Object.entries(o)) {
        if (typeof value === "object") {
            let result = JSON.stringify(value, undefined, " ");
            result = result.replace(/\n/g, " ");
            result = result.replace(/ +/g, " ");
            result = result.replace(/\[ /g, "[");
            result = result.replace(/ ]/g, "]");
            o[key] = result;
        }
    }
    return o;
};
exports.flattenObject = flattenObject;
const deepClone = (o) => {
    if (typeof o !== "object") {
        return o;
    }
    const result = {};
    for (const [key, value] of Object.entries(o)) {
        result[key] = (0, exports.deepClone)(value);
    }
    return result;
};
exports.deepClone = deepClone;
const extractMarker = (value) => {
    if (value && typeof value !== "object") {
        return undefined;
    }
    const v = value;
    if (typeof v.symbol !== "symbol") {
        return undefined;
    }
    switch (v.symbol.description) {
        case "ignore": {
            return {
                type: "ignore",
            };
        }
        case "regex": {
            return {
                type: "regex",
                parameters: v.parameters,
            };
        }
        case "list": {
            return {
                type: "list",
                parameters: v.parameters,
            };
        }
        default:
    }
};
const deepEqual = (a, b) => {
    if (a === b) {
        return true;
    }
    if (a === undefined || b === undefined) {
        return false;
    }
    const typeOfA = typeof a;
    const typeOfB = typeof b;
    const markerA = extractMarker(a);
    const markerB = extractMarker(b);
    if (markerA || markerB) {
        if (markerA && markerB) {
            return false;
        }
        const value = markerA ? b : a;
        const marker = markerA ?? markerB;
        switch (marker?.type) {
            case "ignore": {
                return true;
            }
            case "regex": {
                const pattern = new RegExp(marker.parameters);
                return typeof value === "string" && pattern.exec(value) !== null;
            }
            case "list": {
                if (!Array.isArray(value)) {
                    return false;
                }
                const list = marker.parameters.list;
                const full = marker.parameters.full;
                if (full && value.length !== list.length) {
                    return false;
                }
                for (let i = 0; i < list.length; ++i) {
                    if (!(0, exports.deepEqual)(value[i], list[i])) {
                        return false;
                    }
                }
                return true;
            }
            default: {
                return false;
            }
        }
    }
    if ((typeOfA === "object") && (typeOfB === "object")) {
        const objA = a;
        const objB = b;
        if (Object.keys(objA).length !== Object.keys(objB).length) {
            return false;
        }
        for (const key in objA) {
            if (!(key in objB) || !(0, exports.deepEqual)(objA[key], objB[key])) {
                return false;
            }
        }
        return true;
    }
    else if ((typeof a == "object") || (typeof b == "object")) {
        return false;
    }
    else {
        return Object.is(a, b);
    }
};
exports.deepEqual = deepEqual;
const strictEval = (code) => {
    return Function("'use strict';return (" + code + ")")();
};
exports.strictEval = strictEval;
const deepMapKeys = (o, ignoreList, fn) => {
    const result = {};
    for (const [k, v] of Object.entries(o)) {
        let actualValue = v;
        if (!ignoreList.includes(k)) {
            if (Array.isArray(v)) {
                actualValue = (0, exports.deepMapArray)(v, ignoreList, fn);
            }
            else if (v !== null && typeof v === "object") {
                actualValue = (0, exports.deepMapKeys)(v, ignoreList, fn);
            }
        }
        result[fn(v, k)] = actualValue;
    }
    return result;
};
exports.deepMapKeys = deepMapKeys;
const deepMapArray = (a, ignoreList, fn) => {
    return a.map((v) => {
        if (Array.isArray(v)) {
            return (0, exports.deepMapArray)(v, ignoreList, fn);
        }
        else if (v !== null && typeof v === "object") {
            return (0, exports.deepMapKeys)(v, ignoreList, fn);
        }
        return v;
    });
};
exports.deepMapArray = deepMapArray;
exports.KeyboardKeys = {
    Alt: "Alt",
    AltGraph: "AltGraph",
    CapsLock: "CapsLock",
    Control: "Control",
    Fn: "Fn",
    FnLock: "FnLock",
    Hyper: "Hyper",
    Meta: "Meta",
    NumLock: "NumLock",
    ScrollLock: "ScrollLock",
    Shift: "Shift",
    Super: "Super",
    Symbol: "Symbol",
    SymbolLock: "SymbolLock",
    Enter: "Enter",
    Tab: "Tab",
    Space: " ",
    ArrowDown: "ArrowDown",
    ArrowLeft: "ArrowLeft",
    ArrowRight: "ArrowRight",
    ArrowUp: "ArrowUp",
    End: "End",
    Home: "Home",
    PageDown: "PageDown",
    PageUp: "PageUp",
    Backspace: "Backspace",
    Clear: "Clear",
    Copy: "Copy",
    CrSel: "CrSel",
    Cut: "Cut",
    Delete: "Delete",
    EraseEof: "EraseEof",
    ExSel: "ExSel",
    Insert: "Insert",
    Paste: "Paste",
    Redo: "Redo",
    Undo: "Undo",
    Accept: "Accept",
    Again: "Again",
    Attn: "Attn",
    Cancel: "Cancel",
    ContextMenu: "ContextMenu",
    Escape: "Escape",
    Execute: "Execute",
    Find: "Find",
    Finish: "Finish",
    Help: "Help",
    Pause: "Pause",
    Play: "Play",
    Props: "Props",
    Select: "Select",
    ZoomIn: "ZoomIn",
    ZoomOut: "ZoomOut",
    BrightnessDown: "BrightnessDown",
    BrightnessUp: "BrightnessUp",
    Eject: "Eject",
    LogOff: "LogOff",
    Power: "Power",
    PowerOff: "PowerOff",
    PrintScreen: "PrintScreen",
    Hibernate: "Hibernate",
    Standby: "Standby",
    WakeUp: "WakeUp",
    AllCandidates: "AllCandidates",
    Alphanumeric: "Alphanumeric",
    CodeInput: "CodeInput",
    Compose: "Compose",
    Convert: "Convert",
    Dead: "Dead",
    FinalMode: "FinalMode",
    GroupFirst: "GroupFirst",
    GroupLast: "GroupLast",
    GroupNext: "GroupNext",
    GroupPrevious: "GroupPrevious",
    ModeChange: "ModeChange",
    NextCandidate: "NextCandidate",
    NonConvert: "NonConvert",
    PreviousCandidate: "PreviousCandidate",
    Process: "Process",
    SingleCandidate: "SingleCandidate",
    F1: "F1",
    F2: "F2",
    F3: "F3",
    F4: "F4",
    F5: "F5",
    F6: "F6",
    F7: "F7",
    F8: "F8",
    F9: "F9",
    F10: "F10",
    F11: "F11",
    F12: "F12",
    F13: "F13",
    F14: "F14",
    F15: "F15",
    F16: "F16",
    F17: "F17",
    F18: "F18",
    F19: "F19",
    F20: "F20",
    Soft1: "Soft1",
    Soft2: "Soft2",
    Soft3: "Soft3",
    Soft4: "Soft4",
    AppSwitch: "AppSwitch",
    Call: "Call",
    Camera: "Camera",
    CameraFocus: "CameraFocus",
    EndCall: "EndCall",
    GoBack: "GoBack",
    GoHome: "GoHome",
    HeadsetHook: "HeadsetHook",
    LastNumberRedial: "LastNumberRedial",
    Notification: "Notification",
    MannerMode: "MannerMode",
    VoiceDial: "VoiceDial",
    ChannelDown: "ChannelDown",
    ChannelUp: "ChannelUp",
    MediaFastForward: "MediaFastForward",
    MediaPause: "MediaPause",
    MediaPlay: "MediaPlay",
    MediaPlayPause: "MediaPlayPause",
    MediaRecord: "MediaRecord",
    MediaRewind: "MediaRewind",
    MediaStop: "MediaStop",
    MediaTrackNext: "MediaTrackNext",
    MediaTrackPrevious: "MediaTrackPrevious",
    AudioBalanceLeft: "AudioBalanceLeft",
    AudioBalanceRight: "AudioBalanceRight",
    AudioBassDown: "AudioBassDown",
    AudioBassBoostDown: "AudioBassBoostDown",
    AudioBassBoostToggle: "AudioBassBoostToggle",
    AudioBassBoostUp: "AudioBassBoostUp",
    AudioBassUp: "AudioBassUp",
    AudioFaderFront: "AudioFaderFront",
    AudioFaderRear: "AudioFaderRear",
    AudioSurroundModeNext: "AudioSurroundModeNext",
    AudioTrebleDown: "AudioTrebleDown",
    AudioTrebleUp: "AudioTrebleUp",
    AudioVolumeDown: "AudioVolumeDown",
    AudioVolumeMute: "AudioVolumeMute",
    AudioVolumeUp: "AudioVolumeUp",
    MicrophoneToggle: "MicrophoneToggle",
    MicrophoneVolumeDown: "MicrophoneVolumeDown",
    MicrophoneVolumeMute: "MicrophoneVolumeMute",
    MicrophoneVolumeUp: "MicrophoneVolumeUp",
    Close: "Close",
    New: "New",
    Open: "Open",
    Print: "Print",
    Save: "Save",
    SpellCheck: "SpellCheck",
    MailForward: "MailForward",
    MailReply: "MailReply",
    MailSend: "MailSend",
    LaunchCalculator: "LaunchCalculator",
    LaunchCalendar: "LaunchCalendar",
    LaunchContacts: "LaunchContacts",
    LaunchMail: "LaunchMail",
    LaunchMediaPlayer: "LaunchMediaPlayer",
    LaunchMusicPlayer: "LaunchMusicPlayer",
    LaunchMyComputer: "LaunchMyComputer",
    LaunchPhone: "LaunchPhone",
    LaunchScreenSaver: "LaunchScreenSaver",
    LaunchSpreadsheet: "LaunchSpreadsheet",
    LaunchWebBrowser: "LaunchWebBrowser",
    LaunchWebCam: "LaunchWebCam",
    LaunchWordProcessor: "LaunchWordProcessor",
    LaunchApplication1: "LaunchApplication1",
    LaunchApplication2: "LaunchApplication2",
    LaunchApplication3: "LaunchApplication3",
    LaunchApplication4: "LaunchApplication4",
    LaunchApplication5: "LaunchApplication5",
    LaunchApplication6: "LaunchApplication6",
    LaunchApplication7: "LaunchApplication7",
    LaunchApplication8: "LaunchApplication8",
    LaunchApplication9: "LaunchApplication9",
    LaunchApplication10: "LaunchApplication10",
    LaunchApplication11: "LaunchApplication11",
    LaunchApplication12: "LaunchApplication12",
    LaunchApplication13: "LaunchApplication13",
    LaunchApplication14: "LaunchApplication14",
    LaunchApplication15: "LaunchApplication15",
    LaunchApplication16: "LaunchApplication16",
    BrowserBack: "BrowserBack",
    BrowserFavorites: "BrowserFavorites",
    BrowserForward: "BrowserForward",
    BrowserHome: "BrowserHome",
    BrowserRefresh: "BrowserRefresh",
    BrowserSearch: "BrowserSearch",
    BrowserStop: "BrowserStop",
    Decimal: "Decimal",
    Key11: "Key11",
    Key12: "Key12",
    Multiply: "Multiply",
    Add: "Add",
    Divide: "Divide",
    Subtract: "Subtract",
    Separator: "Separator",
    Zero: "0",
    One: "1",
    Two: "2",
    Three: "3",
    Four: "4",
    Five: "5",
    Six: "6",
    Seven: "7",
    Eight: "8",
    Nine: "9",
    A: "a",
    B: "b",
    C: "c",
    D: "d",
    E: "e",
    F: "f",
    G: "g",
    H: "h",
    I: "i",
    J: "j",
    K: "k",
    L: "l",
    M: "m",
    N: "n",
    O: "o",
    P: "p",
    Q: "q",
    R: "r",
    S: "s",
    T: "t",
    U: "u",
    V: "v",
    W: "w",
    X: "x",
    Y: "y",
    Z: "z",
};
//# sourceMappingURL=helpers.js.map