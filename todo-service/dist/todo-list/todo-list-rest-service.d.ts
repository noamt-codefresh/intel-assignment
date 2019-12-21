import { Server } from "restify";
import { TodoListLogic } from "./todo-list-logic";
import { Routable } from "../types/todo-list-types";
export declare class TodoListRestService implements Routable {
    private _todoListLogic;
    constructor(_todoListLogic: TodoListLogic);
    registerRoutes(restServer: Server): void;
    private _getTodoLists;
    private _addTodoList;
    private _getTodoListItems;
    private _addTodoListItem;
    private _updateTodoListItem;
    private _deleteTodoListItem;
}
