export declare class ErrorWithCode extends Error {
    message: string;
    code: string;
    constructor(message: string, code: string);
    toString(): string;
}
