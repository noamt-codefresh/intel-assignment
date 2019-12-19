import {
    ERROR_CODES,
    TodoList, TodoListCacheManager,
    TodoListDal,
    TodoListInput,
    TodoListItem,
    TodoListItemInput
} from "../types/todo-list-types";
import {TodoListTypeGuard} from "../types/todo-list-type-guard";
import {ErrorWithCode} from "../errors/error-with-code";
import Q = require("q");
import _ = require("lodash");

const TODO_LISTS_CACHE_KEY_PREFIX: string = "todo:lists";

export class TodoListLogic {

    constructor(private _todoListDal: TodoListDal, private _todoListCacheManager: TodoListCacheManager) {}

    public async getTodoLists(userId: string): Promise<TodoList[]> {
        if(!userId) {
            return Q.reject(new ErrorWithCode("received undefined used id",  ERROR_CODES.USER_INVALID_INPUT));
        }

        console.log("TodoListLogic.getTodoLists: Retrieving todo lists for user", userId);

        let todoLists: TodoList[];
        try {
            todoLists = await this._todoListDal.getTodoLists(userId);
        } catch (err) {
            return Q.reject(err);
        }

        console.log("TodoListLogic.getTodoLists: Successfully retrieved", _.size(todoLists), "todo lists for user", userId);
        return todoLists;

    }

    public async addTodoList(todoListInput: TodoListInput): Promise<TodoList> {
        if(!TodoListTypeGuard.isTodoListInput(todoListInput)) {
            const error = new ErrorWithCode(`received invalid todo list input: '${ JSON.stringify(todoListInput) }'`,  ERROR_CODES.USER_INVALID_INPUT);
            return Q.reject(error);
        }
        console.log("TodoListLogic.addTodoList: Adding todo list", todoListInput.title, "for user", todoListInput.userId);

        let todoList: TodoList;
        try {
            todoList = await this._todoListDal.addTodoList(todoListInput);
        } catch (err) {
            return Q.reject(err);
        }

        console.log("TodoListLogic.addTodoList: Successfully added todo list", todoListInput.title, "for user", todoListInput.userId);
        return todoList;

    }

    public async getTodoListItems(todoListId: string, userId: string): Promise<TodoListItem[]> {
        if (!todoListId || !userId) {
            return Q.reject(new ErrorWithCode(`received invalid list id: ${todoListId} or user id: ${userId}`, ERROR_CODES.USER_INVALID_INPUT));
        }

        console.log("TodoListLogic.getTodoListItems: Retrieving todo list items for list", todoListId);

        const key = `${TODO_LISTS_CACHE_KEY_PREFIX}:${userId}:${todoListId}`;
        let todoListItems: TodoListItem[];

        try {
            todoListItems = await this._todoListCacheManager.get(key);
            if (todoListItems){
                return todoListItems;
            }
        } catch (err) {
            console.error("TodoListLogic.getTodoListItems: Failed retrieving cache for key", key, "on", err);
        }

        try {
            todoListItems = await this._todoListDal.getTodoListItems(todoListId);
        } catch (err) {
            return Q.reject(err);
        }

        try {
            console.debug("TodoListLogic.getTodoListItems: creating cache for key", key);
            this._todoListCacheManager.create(key, todoListItems);
        } catch (err) {
            console.error("TodoListLogic.getTodoListItems: Failed setting cache for key", key, "on", err);
        }

        console.log("TodoListLogic.getTodoListItems: Successfully added todo list", todoListId);
        return todoListItems;
    }

    public async addTodoListItem(todoListId: string, todoListItemInput: TodoListItemInput, userId: string): Promise<TodoListItem> {
        if(!TodoListTypeGuard.isTodoListItemInput(todoListItemInput)) {
            const error = new ErrorWithCode(`received invalid todo list item input: '${ JSON.stringify(todoListItemInput) }'`,  ERROR_CODES.USER_INVALID_INPUT);
            return Q.reject(error);
        }

        console.log("TodoListLogic.addTodoListItem: Adding todo list item", todoListItemInput.name);

        let todoListItem: TodoListItem;
        try {
            todoListItem = await this._todoListDal.addTodoListItem(todoListId, todoListItemInput);
        } catch (err) {
            return Q.reject(err);
        }

        console.log("TodoListLogic.addTodoListItem: Successfully added todo list item", todoListItemInput.name);
        const key = `${TODO_LISTS_CACHE_KEY_PREFIX}:${userId}:${todoListId}`;

        try {
            await this._updateTodoCache(key, todoListItem);
        } catch (err) {
            console.error("TodoListLogic.addTodoListItem: Failed setting cache for key", key);
        }

        return todoListItem;
    }

    public async updateTodoListItem(todoListId: string, listItem: TodoListItem, userId: string): Promise<void> {
        if(!TodoListTypeGuard.isTodoListItem(listItem)) {
            const error = new ErrorWithCode(`received invalid todo list item input: '${ JSON.stringify(listItem) }'`,  ERROR_CODES.USER_INVALID_INPUT);
            return Q.reject(error);
        }

        console.log("TodoListLogic.updateTodoListItem: Updating todo list item", todoListId);

        try {
            await this._todoListDal.updateTodoListItem(todoListId, listItem);
        } catch (err) {
            return Q.reject(err);
        }

        const key = `${TODO_LISTS_CACHE_KEY_PREFIX}:${userId}:${todoListId}`;
        try {
            await this._updateTodoCache(key, listItem);
        } catch (err) {
            console.error("TodoListLogic.addTodoListItem: Failed setting cache for key", key);
        }

        console.log("TodoListLogic.updateTodoListItem: Successfully added todo list item", todoListId);
        return Q.resolve(undefined);
    }

    public async deleteTodoListItem(todoListId: string, todoListItemId: string, userId: string): Promise<void> {
        if (!todoListId || !todoListItemId) {
           return Q.reject(new ErrorWithCode(`received invalid list id: ${todoListId} or list item: ${todoListItemId}`, ERROR_CODES.USER_INVALID_INPUT));
        }

        console.log("TodoListLogic.deleteTodoListItem: deleting todo list item", todoListItemId);

        try {
            await this._todoListDal.deleteTodoListItem(todoListId, todoListItemId);
        } catch (err) {
            return Q.reject(err);
        }

        const key = `${TODO_LISTS_CACHE_KEY_PREFIX}:${userId}:${todoListId}`;
        try {
            await this._todoListCacheManager.deleteHashField(key, todoListItemId);
        } catch (err) {
            console.error("TodoListLogic.addTodoListItem: Failed setting cache for key", key);
        }

        console.log("TodoListLogic.deleteTodoListItem: Successfully deleted todo list item", todoListItemId);
        return Q.resolve(undefined);

    }

    private _updateTodoCache(key: string, todoListItem: TodoListItem): Q.Promise<void> {
        if (!key || !todoListItem) {
            return Q.reject(new Error(`received invalid list id: ${key} or list item: ${todoListItem}`));
        }

        return this._todoListCacheManager.update(key, todoListItem).catch((err: Error) => {
            console.error("TodoListLogic.addTodoListItem: Failed setting cache for key", key, "on", err, ", invalidating cache...");
            return this._todoListCacheManager.delete(key);
        }).catch((err: Error) => {
            console.error("TodoListLogic.addTodoListItem: [FATAL] Failed to clear cache key", key, "on", err);
        })
    }


}
