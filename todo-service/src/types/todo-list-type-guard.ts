import {TodoListInput, TodoListItem, TodoListItemInput, UserInput} from "./todo-list-types";


export class TodoListTypeGuard {

    public static isUserInput(arg: any): arg is UserInput {
           return arg && arg.name && arg.password
    }

    public static isTodoListInput(arg: any): arg is TodoListInput {
        return arg && arg.userId && arg.title;
    }

    public static isTodoListItemInput(arg: any): arg is TodoListItemInput {
        return arg && arg.name && arg.done !== undefined;
    }

    public static isTodoListItem(arg: any): arg is TodoListItem {
        return arg && arg._id && TodoListTypeGuard.isTodoListItemInput(arg);
    }
}
