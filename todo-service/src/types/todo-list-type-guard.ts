import {UserInput} from "./todo-list-types";
import {ErrorWithCode} from "../errors/error-with-code";




export class TodoListTypeGuard {

    public static isUserInput(arg: any): arg is UserInput {
           return arg && arg.name && arg.password
    }

    public static isErrorWithCode(arg: any): arg is ErrorWithCode {
        return arg && arg.message && arg.code;
    }

}
