
import {Next, Request, Response, Server} from "restify";
import {TodoListLogic} from "./todo-list-logic";
import {Routable, TodoList, User} from "../types/todo-list-types";
import {ErrorUtils} from "../utils/error-utils";
import {TodoListInput} from "../../dist/types/todo-list-types";


export class TodoListRestService implements Routable {

    constructor(private _todoListLogic: TodoListLogic) {}

    public registerRoutes(restServer: Server): void {
        restServer.get("/:userId/todo/lists", this._getTodoLists.bind(this));
        restServer.post("/:userId/todo/list", this._addTodoList.bind(this));
        restServer.patch("/:userId/todo/:listId/item", this._updateTodoList.bind(this));
        restServer.post("/:userId/todo/:listId/item", this._updateTodoList.bind(this));
        restServer.del("/:userId/todo/:listId/item", this._deleteTodoList.bind(this));
    }

    private async _getTodoLists(req: Request, res: Response, next: Next): Promise<TodoList[]> {
        /*    try {
               const todoLists = await this._todoListLogic.()
            } catch (err) {

            }
            return this;*/
        return null;
    }

    private async _addTodoList(req: Request, res: Response, next: Next): Promise<void> {
        let error = null;
        try {
            const todoListInput: TodoListInput =  Object.assign(req.body, req.query._id);
            const todoList: TodoList = await this._todoListLogic.addTodoList(todoListInput);
            res.send(201, todoList);
        } catch (e) {
            error = e;
            console.error("UsersRestService._addTodoList: Failed adding todo list on", error.stack);
            const {message, code, httpStatus} = ErrorUtils.httpErrorHandler(error);
            res.send(httpStatus, {message, code});
        } finally {
            next(error);
        }
    }

    private async _updateTodoList(req: Request, res: Response, next: Next): Promise<void> {
        res.send(204)
    }

    private async _deleteTodoList(req: Request, res: Response, next: Next): Promise<void> {

    }

}
