import {UserInput} from "./todo-list-types";


export class TodoListTypeGuard {

    public static isUserInput(arg: any): arg is UserInput {
           return arg && arg.name && arg.password
    }

}
