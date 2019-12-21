"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorWithCode extends Error {
    constructor(message, code) {
        super(message);
        this.message = message;
        this.code = code;
    }
    toString() {
        return `[${this.code}] ${this.message}`;
    }
}
exports.ErrorWithCode = ErrorWithCode;
//# sourceMappingURL=error-with-code.js.map