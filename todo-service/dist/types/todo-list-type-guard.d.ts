import { TodoListInput, TodoListItem, TodoListItemInput, UserInput } from "./todo-list-types";
export declare class TodoListTypeGuard {
    static isUserInput(arg: any): arg is UserInput;
    static isTodoListInput(arg: any): arg is TodoListInput;
    static isTodoListItemInput(arg: any): arg is TodoListItemInput;
    static isTodoListItem(arg: any): arg is TodoListItem;
}
