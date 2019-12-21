"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_utils_1 = require("../utils/error-utils");
const _ = require("lodash");
class TodoListRestService {
    constructor(_todoListLogic) {
        this._todoListLogic = _todoListLogic;
    }
    registerRoutes(restServer) {
        restServer.get("/todo/lists", this._getTodoLists.bind(this));
        restServer.post("/todo/lists", this._addTodoList.bind(this));
        restServer.get("/todo/lists/:listId/items", this._getTodoListItems.bind(this));
        restServer.post("/todo/lists/:listId/item", this._addTodoListItem.bind(this));
        restServer.put("/todo/lists/:listId/item/:itemId", this._updateTodoListItem.bind(this));
        restServer.del("/todo/lists/:listId/item/:itemId", this._deleteTodoListItem.bind(this));
    }
    async _getTodoLists(req, res, next) {
        var _a;
        let error = null;
        try {
            const { userId } = (_a = req) === null || _a === void 0 ? void 0 : _a.user;
            const todoLists = await this._todoListLogic.getTodoLists(userId);
            res.send(200, todoLists);
        }
        catch (e) {
            error = e;
            console.error("UsersRestService._getTodoLists: Failed adding todo list on", error.stack);
            const { message, code, httpStatus } = error_utils_1.ErrorUtils.httpErrorHandler(error);
            res.send(httpStatus, { message, code });
        }
        finally {
            next(error);
        }
    }
    async _addTodoList(req, res, next) {
        var _a, _b;
        let error = null;
        try {
            const todoListInput = Object.assign(req.body, { userId: (_b = (_a = req) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.userId });
            const todoList = await this._todoListLogic.addTodoList(todoListInput);
            res.send(201, todoList);
        }
        catch (e) {
            error = e;
            console.error("UsersRestService._addTodoList: Failed adding todo list on", error.stack);
            const { message, code, httpStatus } = error_utils_1.ErrorUtils.httpErrorHandler(error);
            res.send(httpStatus, { message, code });
        }
        finally {
            next(error);
        }
    }
    async _getTodoListItems(req, res, next) {
        var _a, _b;
        let error = null;
        try {
            const todoListId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.listId;
            const { userId } = (_b = req) === null || _b === void 0 ? void 0 : _b.user;
            const todoListItems = await this._todoListLogic.getTodoListItems(todoListId, userId);
            res.send(200, todoListItems);
        }
        catch (e) {
            error = e;
            console.error("UsersRestService._getTodoListItems: Failed retrieving todo list items on", error.stack);
            const { message, code, httpStatus } = error_utils_1.ErrorUtils.httpErrorHandler(error);
            res.send(httpStatus, { message, code });
        }
        finally {
            next(error);
        }
    }
    async _addTodoListItem(req, res, next) {
        var _a, _b;
        let error = null;
        try {
            const { userId } = (_a = req) === null || _a === void 0 ? void 0 : _a.user;
            const todoListId = (_b = req.params) === null || _b === void 0 ? void 0 : _b.listId;
            const todoListItemInput = req.body;
            const todoListItem = await this._todoListLogic.addTodoListItem(todoListId, todoListItemInput, userId);
            res.send(201, todoListItem);
        }
        catch (e) {
            error = e;
            console.error("UsersRestService._addTodoListItem: Failed adding todo list on", error.stack);
            const { message, code, httpStatus } = error_utils_1.ErrorUtils.httpErrorHandler(error);
            res.send(httpStatus, { message, code });
        }
        finally {
            next(error);
        }
    }
    async _updateTodoListItem(req, res, next) {
        var _a, _b, _c;
        let error = null;
        try {
            const { userId } = (_a = req) === null || _a === void 0 ? void 0 : _a.user;
            const todoListId = (_b = req.params) === null || _b === void 0 ? void 0 : _b.listId;
            const todoListItemId = (_c = req.params) === null || _c === void 0 ? void 0 : _c.itemId;
            const todoListItem = _.assign(req.body, { _id: todoListItemId });
            await this._todoListLogic.updateTodoListItem(todoListId, todoListItem, userId);
            res.send(204);
        }
        catch (e) {
            error = e;
            console.error("UsersRestService._updateTodoListItem: Failed to set todo list on", error.stack);
            const { message, code, httpStatus } = error_utils_1.ErrorUtils.httpErrorHandler(error);
            res.send(httpStatus, { message, code });
        }
        finally {
            next(error);
        }
    }
    async _deleteTodoListItem(req, res, next) {
        var _a, _b, _c;
        let error = null;
        try {
            const { userId } = (_a = req) === null || _a === void 0 ? void 0 : _a.user;
            const todoListId = (_b = req.params) === null || _b === void 0 ? void 0 : _b.listId;
            const todoListItemId = (_c = req.params) === null || _c === void 0 ? void 0 : _c.itemId;
            await this._todoListLogic.deleteTodoListItem(todoListId, todoListItemId, userId);
            res.send(204);
        }
        catch (e) {
            error = e;
            console.error("UsersRestService._deleteTodoListItem: Failed deleting todo list item on", error.stack);
            const { message, code, httpStatus } = error_utils_1.ErrorUtils.httpErrorHandler(error);
            res.send(httpStatus, { message, code });
        }
        finally {
            next(error);
        }
    }
}
exports.TodoListRestService = TodoListRestService;
//# sourceMappingURL=todo-list-rest-service.js.map