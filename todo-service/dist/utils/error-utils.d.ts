import { ErrorWithCode } from "../errors/error-with-code";
export declare class ErrorUtils {
    static httpErrorHandler(error: ErrorWithCode | Error): {
        message: string;
        code: string;
        httpStatus: number;
    };
}
