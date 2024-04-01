"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cookies = void 0;
class Cookies {
    set(name, value) {
        let cookie = "";
        cookie = `${name}=${value ?? ""}`;
        if (typeof document !== "undefined") {
            document.cookie = cookie;
        }
    }
    get(name) {
        if (typeof document === "undefined" || !document.cookie) {
            return null;
        }
        const cookie = document.cookie.split(";").find((item) => {
            return item.split("=")[0].trim() === name;
        });
        if (cookie) {
            const parts = cookie.split("=");
            if (parts.length === 1) {
                return parts[0];
            }
            return parts[1].trim();
        }
        return null;
    }
    remove(name) {
        if (typeof document !== "undefined") {
            document.cookie = name + "=; Max-Age=0;";
        }
    }
    clear() {
        if (typeof document !== "undefined") {
            for (const cookie of document.cookie.split(";")) {
                this.remove(cookie.split("=")[0].trim());
            }
        }
    }
}
exports.Cookies = Cookies;
//# sourceMappingURL=Cookies.js.map