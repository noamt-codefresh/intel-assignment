import {UserInput} from "./todo-list-types";
import {HttpError} from "../errors/http-error";




export class TodoListTypeGuard {

    public static isUserInput(arg: any): arg is UserInput {
           return arg && arg.name && arg.password
    }

    public static isHttpError(arg: any): arg is HttpError {
        return arg && arg.message && arg.httpStatusCode != null;
    }

}
