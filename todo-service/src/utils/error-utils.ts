

//export class ErrorUtils {

import {TodoListTypeGuard} from "../types/todo-list-type-guard";
import {HttpError} from "../errors/http-error";


export class ErrorUtils {

    public static httpErrorHandler(error: HttpError | Error): { message: string, code: number } {
        if(TodoListTypeGuard.isHttpError(error)) {
            return {message: error.message, code: error.httpStatusCode};
        }

        return { message: error.message, code: 500 };
    }

}





