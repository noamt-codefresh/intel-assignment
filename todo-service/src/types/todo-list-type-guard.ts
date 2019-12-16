import {TodoListInput, UserInput} from "./todo-list-types";


export class TodoListTypeGuard {

    public static isUserInput(arg: any): arg is UserInput {
           return arg && arg.name && arg.password
    }

    public static isTodoListInput(arg: any): arg is TodoListInput {
        return arg && arg.userId && arg.items && arg.title;
    }
}
