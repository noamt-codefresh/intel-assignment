"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todo_list_types_1 = require("../types/todo-list-types");
const todo_list_type_guard_1 = require("../types/todo-list-type-guard");
const error_with_code_1 = require("../errors/error-with-code");
const Q = require("q");
const _ = require("lodash");
const TODO_LISTS_CACHE_KEY_PREFIX = "todo:lists";
class TodoListLogic {
    constructor(_todoListDal, _todoListCacheManager) {
        this._todoListDal = _todoListDal;
        this._todoListCacheManager = _todoListCacheManager;
    }
    async getTodoLists(userId) {
        if (!userId) {
            return Q.reject(new error_with_code_1.ErrorWithCode("received undefined used id", todo_list_types_1.ERROR_CODES.USER_INVALID_INPUT));
        }
        console.log("TodoListLogic.getTodoLists: Retrieving todo lists for user", userId);
        let todoLists;
        try {
            todoLists = await this._todoListDal.getTodoLists(userId);
        }
        catch (err) {
            return Q.reject(err);
        }
        console.log("TodoListLogic.getTodoLists: Successfully retrieved", _.size(todoLists), "todo lists for user", userId);
        return todoLists;
    }
    async addTodoList(todoListInput) {
        if (!todo_list_type_guard_1.TodoListTypeGuard.isTodoListInput(todoListInput)) {
            const error = new error_with_code_1.ErrorWithCode(`received invalid todo list input: '${JSON.stringify(todoListInput)}'`, todo_list_types_1.ERROR_CODES.USER_INVALID_INPUT);
            return Q.reject(error);
        }
        console.log("TodoListLogic.addTodoList: Adding todo list", todoListInput.title, "for user", todoListInput.userId);
        let todoList;
        try {
            todoList = await this._todoListDal.addTodoList(todoListInput);
        }
        catch (err) {
            return Q.reject(err);
        }
        console.log("TodoListLogic.addTodoList: Successfully added todo list", todoListInput.title, "for user", todoListInput.userId);
        return todoList;
    }
    async getTodoListItems(todoListId, userId) {
        if (!todoListId || !userId) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`received invalid list id: ${todoListId} or user id: ${userId}`, todo_list_types_1.ERROR_CODES.USER_INVALID_INPUT));
        }
        console.log("TodoListLogic.getTodoListItems: Retrieving todo list items for list", todoListId);
        const key = `${TODO_LISTS_CACHE_KEY_PREFIX}:${userId}:${todoListId}`;
        let todoListItems;
        try {
            todoListItems = await this._todoListCacheManager.get(key);
            if (todoListItems) {
                console.debug("TodoListLogic.getTodoListItems: using cache key", key);
                return todoListItems;
            }
        }
        catch (err) {
            console.error("TodoListLogic.getTodoListItems: Failed retrieving cache for key", key, "on", err);
        }
        try {
            todoListItems = await this._todoListDal.getTodoListItems(todoListId);
        }
        catch (err) {
            return Q.reject(err);
        }
        try {
            console.debug("TodoListLogic.getTodoListItems: creating cache for key", key);
            this._todoListCacheManager.create(key, todoListItems);
        }
        catch (err) {
            console.error("TodoListLogic.getTodoListItems: Failed setting cache for key", key, "on", err);
        }
        console.log("TodoListLogic.getTodoListItems: Successfully added todo list", todoListId);
        return todoListItems;
    }
    async addTodoListItem(todoListId, todoListItemInput, userId) {
        if (!todo_list_type_guard_1.TodoListTypeGuard.isTodoListItemInput(todoListItemInput)) {
            const error = new error_with_code_1.ErrorWithCode(`received invalid todo list item input: '${JSON.stringify(todoListItemInput)}'`, todo_list_types_1.ERROR_CODES.USER_INVALID_INPUT);
            return Q.reject(error);
        }
        console.log("TodoListLogic.addTodoListItem: Adding todo list item", todoListItemInput.name);
        let todoListItem;
        try {
            todoListItem = await this._todoListDal.addTodoListItem(todoListId, todoListItemInput);
        }
        catch (err) {
            return Q.reject(err);
        }
        console.log("TodoListLogic.addTodoListItem: Successfully added todo list item", todoListItemInput.name);
        const key = `${TODO_LISTS_CACHE_KEY_PREFIX}:${userId}:${todoListId}`;
        try {
            await this._updateTodoCache(key, todoListItem);
        }
        catch (err) {
            console.error("TodoListLogic.addTodoListItem: Failed updating cache for key", key);
        }
        return todoListItem;
    }
    async updateTodoListItem(todoListId, listItem, userId) {
        if (!todo_list_type_guard_1.TodoListTypeGuard.isTodoListItem(listItem)) {
            const error = new error_with_code_1.ErrorWithCode(`received invalid todo list item input: '${JSON.stringify(listItem)}'`, todo_list_types_1.ERROR_CODES.USER_INVALID_INPUT);
            return Q.reject(error);
        }
        console.log("TodoListLogic.updateTodoListItem: Updating todo list item", todoListId);
        try {
            await this._todoListDal.updateTodoListItem(todoListId, listItem);
        }
        catch (err) {
            return Q.reject(err);
        }
        const key = `${TODO_LISTS_CACHE_KEY_PREFIX}:${userId}:${todoListId}`;
        try {
            await this._updateTodoCache(key, listItem);
        }
        catch (err) {
            console.error("TodoListLogic.addTodoListItem: Failed setting cache for key", key);
        }
        console.log("TodoListLogic.updateTodoListItem: Successfully updated todo list item", listItem);
        return Q.resolve(undefined);
    }
    async deleteTodoListItem(todoListId, todoListItemId, userId) {
        if (!todoListId || !todoListItemId) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`received invalid list id: ${todoListId} or list item: ${todoListItemId}`, todo_list_types_1.ERROR_CODES.USER_INVALID_INPUT));
        }
        console.log("TodoListLogic.deleteTodoListItem: deleting todo list item", todoListItemId);
        try {
            await this._todoListDal.deleteTodoListItem(todoListId, todoListItemId);
        }
        catch (err) {
            return Q.reject(err);
        }
        const key = `${TODO_LISTS_CACHE_KEY_PREFIX}:${userId}:${todoListId}`;
        try {
            await this._todoListCacheManager.deleteHashField(key, todoListItemId);
        }
        catch (err) {
            console.error("TodoListLogic.addTodoListItem: Failed updating cache for key", key);
        }
        console.log("TodoListLogic.deleteTodoListItem: Successfully deleted todo list item", todoListItemId);
        return Q.resolve(undefined);
    }
    _updateTodoCache(key, todoListItem) {
        if (!key || !todoListItem) {
            return Promise.reject(new Error(`received invalid list id: ${key} or list item: ${todoListItem}`));
        }
        return this._todoListCacheManager.update(key, todoListItem).catch((err) => {
            console.error("TodoListLogic._updateTodoCache: Failed setting cache for key", key, "on", err, ", invalidating cache...");
            return this._todoListCacheManager.delete(key);
        }).catch((err) => {
            console.error("TodoListLogic._updateTodoCache: [FATAL] Failed to clear cache key", key, "on", err);
        });
    }
}
exports.TodoListLogic = TodoListLogic;
//# sourceMappingURL=todo-list-logic.js.map