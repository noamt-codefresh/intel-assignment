
import {ErrorWithCode} from "../errors/error-with-code";
import {ERROR_CODES} from "../types/todo-list-types";


export class ErrorUtils {

    public static httpErrorHandler(error: ErrorWithCode | Error): { message: string, code: string, httpStatus: number } {

        const code = (error as ErrorWithCode).code || ERROR_CODES.GENERAL_ERROR;
        let httpStatus;

        switch (code) {
            case ERROR_CODES.USER_INVALID_INPUT:
                httpStatus = 400;
                break;
            case ERROR_CODES.USER_EXISTS_ERROR:
                httpStatus = 409;
                break;
            case ERROR_CODES.TODO_LIST_DOESNT_EXIST:
            case ERROR_CODES.USER_DOESNT_EXIST:
                httpStatus = 404;
                break;
            case ERROR_CODES.USER_UNAUTHORIZED_ERROR:
                httpStatus = 401;
                break;
            case ERROR_CODES.THIRD_PARTY_ERROR:
            case ERROR_CODES.DB_ERROR:
            case ERROR_CODES.GENERAL_ERROR:
            default:
                httpStatus = 500;
                break;
        }

        return {message: error.message, code, httpStatus}

    }

}





