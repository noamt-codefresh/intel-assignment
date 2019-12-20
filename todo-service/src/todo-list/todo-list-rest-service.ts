
import {Next, Request, Response, Server} from "restify";
import {TodoListLogic} from "./todo-list-logic";
import {Routable, TodoList, TodoListInput, TodoListItem, TodoListItemInput} from "../types/todo-list-types";
import {ErrorUtils} from "../utils/error-utils";
import _ = require("lodash");


export class TodoListRestService implements Routable {

    constructor(private _todoListLogic: TodoListLogic) {}

    public registerRoutes(restServer: Server): void {
        restServer.get("/todo/lists", this._getTodoLists.bind(this));
        restServer.post("/todo/lists", this._addTodoList.bind(this));

        restServer.get("/todo/lists/:listId/items", this._getTodoListItems.bind(this));
        restServer.post("/todo/lists/:listId/item", this._addTodoListItem.bind(this));
        restServer.put("/todo/lists/:listId/item/:itemId", this._updateTodoListItem.bind(this));
        restServer.del("/todo/lists/:listId/item/:itemId", this._deleteTodoListItem.bind(this));
    }

    private async _getTodoLists(req: Request, res: Response, next: Next): Promise<void> {
        let error = null;
        try {
            const {userId} = (req as any)?.user;
            const todoLists: TodoList[] = await this._todoListLogic.getTodoLists(userId);
            res.send(200, todoLists);
        } catch (e) {
            error = e;
            console.error("UsersRestService._getTodoLists: Failed adding todo list on", error.stack);
            const {message, code, httpStatus} = ErrorUtils.httpErrorHandler(error);
            res.send(httpStatus, {message, code});
        } finally {
            next(error);
        }
    }

    private async _addTodoList(req: Request, res: Response, next: Next): Promise<void> {
        let error = null;
        try {
            const todoListInput: TodoListInput =  Object.assign(req.body, {userId: (req as any)?.user?.userId});
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

    private async _getTodoListItems(req: Request, res: Response, next: Next): Promise<void> {
        let error = null;
        try {
            const todoListId: string = req.params?.listId;
            const {userId} = (req as any)?.user;
            const todoListItems: TodoListItem[] = await this._todoListLogic.getTodoListItems(todoListId, userId);
            res.send(200, todoListItems);
        } catch (e) {
            error = e;
            console.error("UsersRestService._getTodoListItems: Failed retrieving todo list items on", error.stack);
            const {message, code, httpStatus} = ErrorUtils.httpErrorHandler(error);
            res.send(httpStatus, {message, code});
        } finally {
            next(error);
        }
    }

    private async _addTodoListItem(req: Request, res: Response, next: Next): Promise<void> {
        let error = null;
        try {
            const {userId} = (req as any)?.user;
            const todoListId: string = req.params?.listId;
            const todoListItemInput: TodoListItemInput = req.body;
            const todoListItem: TodoListItem = await this._todoListLogic.addTodoListItem(todoListId, todoListItemInput, userId);
            res.send(201, todoListItem);
        } catch (e) {
            error = e;
            console.error("UsersRestService._addTodoListItem: Failed adding todo list on", error.stack);
            const {message, code, httpStatus} = ErrorUtils.httpErrorHandler(error);
            res.send(httpStatus, {message, code});
        } finally {
            next(error);
        }
    }

    private async _updateTodoListItem(req: Request, res: Response, next: Next): Promise<void> {
        let error = null;
        try {
            const {userId} = (req as any)?.user;
            const todoListId: string = req.params?.listId;
            const todoListItemId: string = req.params?.itemId;
            const todoListItem: TodoListItem = _.assign(req.body, {_id: todoListItemId});
            await this._todoListLogic.updateTodoListItem(todoListId, todoListItem, userId);
            res.send(204)
        } catch (e) {
            error = e;
            console.error("UsersRestService._updateTodoListItem: Failed to set todo list on", error.stack);
            const {message, code, httpStatus} = ErrorUtils.httpErrorHandler(error);
            res.send(httpStatus, {message, code});
        } finally {
            next(error);
        }

    }

    private async _deleteTodoListItem(req: Request, res: Response, next: Next): Promise<void> {
        let error = null;
        try {
            const {userId} = (req as any)?.user;
            const todoListId: string = req.params?.listId;
            const todoListItemId: string = req.params?.itemId;
            await this._todoListLogic.deleteTodoListItem(todoListId, todoListItemId, userId);
            res.send(204)
        } catch (e) {
            error = e;
            console.error("UsersRestService._deleteTodoListItem: Failed deleting todo list item on", error.stack);
            const {message, code, httpStatus} = ErrorUtils.httpErrorHandler(error);
            res.send(httpStatus, {message, code});
        } finally {
            next(error);
        }
    }

}
