

//export class ErrorUtils {

import {TodoListTypeGuard} from "../types/todo-list-type-guard";
import {ErrorWithCode} from "../errors/error-with-code";
import {ERROR_CODES} from "../types/todo-list-types";


export class ErrorUtils {

    public static httpErrorHandler(error: ErrorWithCode | Error): { message: string, code: string, httpStatus: number } {

        const errorCode = (error as ErrorWithCode).code || ERROR_CODES.GENERAL_ERROR;
        switch (errorCode) {

            case ERROR_CODES.USER_EXISTS_ERROR: return { message: error.message, code: errorCode, httpStatus: 409 };
            case ERROR_CODES.USER_DOESNT_EXIST: return { message: error.message, code: errorCode, httpStatus: 404 };
            case ERROR_CODES.USER_UNAUTHORIZED_ERROR: return { message: error.message, code: errorCode, httpStatus: 401 };
            case ERROR_CODES.THIRD_PARTY_ERROR:
            case ERROR_CODES.DB_ERROR:
            case ERROR_CODES.GENERAL_ERROR:
            default: return { message: error.message, code: errorCode, httpStatus: 500 };
        }

    }

}





