import Restify from "restify";
import {Next, Request, Response} from "restify";
import {TodoListLogic} from "./todo-list-logic";
import {TodoList} from "../types/todo-types";


export class TodoListRestService {

    private _server: Restify.Server;

    constructor(private _todoListLogic: TodoListLogic) {

        this._server.get(":userId/todo/lists", this._getTodoLists.bind(this));
        this._server.post(":userId/todo/list", this._addTodoList.bind(this));
        this._server.patch(":userId/todo/:listId", this._updateTodoList.bind(this));
        this._server.del(":userId/todo/:listId", this._deleteTodoList.bind(this));

    }

    private _getTodoLists(req: Request, res: Response, next: Next): Promise<TodoList[]> {
            return null;
    }

    private _addTodoList(req: Request, res: Restify.Response, next: Next): Promise<void> {
        res.send(201)
    }

    private _updateTodoList(req: Request, res: Response, next: Next): Promise<void> {
        res.send(204)
    }

    private _deleteTodoList(req: Request, res: Response, next: Next): Promise<void> {

    }

}