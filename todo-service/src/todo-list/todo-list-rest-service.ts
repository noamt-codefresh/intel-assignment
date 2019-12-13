import Restify from "restify";
import {Next, Request, Response} from "restify";
import {TodoListLogic} from "./todo-list-logic";
import {TodoList} from "../types/todo-list-types";


export class TodoListRestService {

    private _server: Restify.Server;

    constructor(private _todoListLogic: TodoListLogic) {

        this._server.get(":userId/todo/lists", this._getTodoLists.bind(this));
        this._server.post(":userId/todo/list", this._addTodoList.bind(this));
        this._server.patch(":userId/todo/:listId/item", this._updateTodoList.bind(this));
        this._server.post(":userId/todo/:listId/item", this._updateTodoList.bind(this));
        this._server.del(":userId/todo/:listId/item", this._deleteTodoList.bind(this));

    }

    private async _getTodoLists(req: Request, res: Response, next: Next): Promise<TodoList[]> {
            try {
               const todoLists = await this._todoListLogic.()
            } catch (err) {

            }
            return this;
    }

    private async _addTodoList(req: Request, res: Restify.Response, next: Next): Promise<void> {
        res.send(201)
    }

    private async _updateTodoList(req: Request, res: Response, next: Next): Promise<void> {
        res.send(204)
    }

    private async _deleteTodoList(req: Request, res: Response, next: Next): Promise<void> {

    }

}