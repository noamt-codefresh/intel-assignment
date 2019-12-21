"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todo_list_types_1 = require("../types/todo-list-types");
const mongodb_1 = require("mongodb");
const Q = require("q");
const error_with_code_1 = require("../errors/error-with-code");
const _ = require("lodash");
const TODO_LIST_COLLECTION_NAME = "todoLists";
class TodoListMongoDal {
    async init(mongoClient) {
        if (!mongoClient.isConnected()) {
            return Q.reject(new Error("failed to initialize UsersMongoDal, no available mongo connection"));
        }
        console.log(`${this.constructor.name}.init: initializing...`);
        try {
            this._todoListCollection = await mongoClient.db(todo_list_types_1.TODO_LIST_DB_NAME).createCollection(TODO_LIST_COLLECTION_NAME);
        }
        catch (e) {
            return Q.reject(new Error(`failed creating ${TODO_LIST_COLLECTION_NAME} collection for db: ${todo_list_types_1.TODO_LIST_DB_NAME}, received error: ${e}`));
        }
        console.log(`${this.constructor.name}.init: initialized successfully`);
    }
    async getTodoLists(userId) {
        if (!userId) {
            return Q.reject(new Error('data store received undefined user id'));
        }
        console.debug(`${this.constructor.name}.getTodoLists: Retrieving todo lists for user '${userId}'`);
        let todoLists;
        try {
            todoLists = await this._todoListCollection.find({ userId }).project({ userId: 0, items: 0 }).toArray();
        }
        catch (err) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`failed while trying to query todo lists with query ${{ userId }} on: ${err}`, todo_list_types_1.ERROR_CODES.DB_ERROR));
        }
        console.debug(`${this.constructor.name}.getTodoLists: Successfully retrieved ${_.size(todoLists)} todo lists for user ${userId}'`);
        return todoLists;
    }
    async getTodoListItems(todoListId) {
        if (!todoListId) {
            return Q.reject(new Error('data store received undefined todoList id'));
        }
        console.debug(`${this.constructor.name}.getTodoListItems: Retrieving items for list '${todoListId}'`);
        let todoList;
        try {
            todoList = await this._todoListCollection.findOne({ _id: new mongodb_1.ObjectId(todoListId) });
        }
        catch (err) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`failed while trying to query items with query ${{ todoListId }} on: ${err}`, todo_list_types_1.ERROR_CODES.DB_ERROR));
        }
        if (!todoList) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`cannot find list: ${todoListId}`, todo_list_types_1.ERROR_CODES.TODO_LIST_DOESNT_EXIST));
        }
        console.debug(`${this.constructor.name}.getTodoListItems: Successfully retrieved list ${_.size(todoList.items)} items for list ${todoListId}'`);
        return todoList.items;
    }
    async addTodoList(todoListInput) {
        if (!todoListInput) {
            return Q.reject(new Error('data store received undefined todo list'));
        }
        todoListInput = _.assign(todoListInput, { items: [] });
        console.debug(`${this.constructor.name}.addTodoList: Adding todo list '${todoListInput.title}' for user '${todoListInput.userId}'`);
        let result;
        try {
            result = await this._todoListCollection.insertOne(todoListInput);
        }
        catch (err) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`failed while trying to insert todo list: '${todoListInput.title}' on: ${err}`, todo_list_types_1.ERROR_CODES.DB_ERROR));
        }
        const todoList = Object.assign(todoListInput, { _id: result.insertedId });
        // TODO: implement cache here with hmset in order to get access later when item changes and remove middle ware
        console.debug(`${this.constructor.name}.addTodoList: Successfully added todo list '${todoList.title} with id '${todoList._id.toHexString()}'`);
        return todoList;
    }
    async addTodoListItem(todoListId, todoListItemInput) {
        if (!todoListItemInput || !todoListId) {
            return Q.reject(new Error(`data store received invalid args: todo list item: ${todoListItemInput} / todo list id: ${todoListId}`));
        }
        console.debug(`${this.constructor.name}.addTodoListItem: Adding todo list item '${todoListItemInput.name}'`);
        const todoListItem = _.assign(todoListItemInput, { _id: new mongodb_1.ObjectId() });
        let result;
        try {
            result = await this._todoListCollection.updateOne({ _id: new mongodb_1.ObjectId(todoListId) }, { $push: { items: todoListItem } });
        }
        catch (err) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`failed while trying to insert todo list item: '${todoListItemInput.name}' on: ${err}`, todo_list_types_1.ERROR_CODES.DB_ERROR));
        }
        const { matchedCount } = result;
        if (!matchedCount) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`failed to add item: ${todoListItem.name}, cannot find list id: ${todoListId}`, todo_list_types_1.ERROR_CODES.TODO_LIST_DOESNT_EXIST));
        }
        console.debug(`${this.constructor.name}.addTodoListItem: Successfully added todo list item '${todoListItem.name} with id '${todoListItem._id.toHexString()}'`);
        return todoListItem;
    }
    async updateTodoListItem(todoListId, todoListItem) {
        if (!todoListItem || !todoListId) {
            return Q.reject(new Error(`data store received invalid args: todo list item: ${todoListItem} / todo list id: ${todoListId}`));
        }
        console.debug(`${this.constructor.name}.updateTodoListItem: Updating todo list item '${todoListItem._id} of list ${todoListId}'`);
        todoListItem._id = new mongodb_1.ObjectId(todoListItem._id);
        let result;
        try {
            result = await this._todoListCollection.updateOne({ _id: new mongodb_1.ObjectId(todoListId), "items._id": todoListItem._id }, { $set: { "items.$": todoListItem } });
        }
        catch (err) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`failed while trying to update todo list item: '${todoListItem._id}' on: ${err}`, todo_list_types_1.ERROR_CODES.DB_ERROR));
        }
        const { matchedCount } = result;
        if (!matchedCount) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`failed to update item, cannot find list: ${todoListId} or item: ${todoListItem._id}`, todo_list_types_1.ERROR_CODES.TODO_LIST_DOESNT_EXIST));
        }
        console.debug(`${this.constructor.name}.updateTodoListItem: Successfully updated todo list item '${todoListItem._id} of list '${todoListId}'`);
        return Q.resolve(undefined);
    }
    async deleteTodoListItem(todoListId, todoListItemId) {
        if (!todoListId || !todoListItemId) {
            return Q.reject(new Error(`data store received invalid args: todo list item: ${todoListItemId} / todo list id: ${todoListId}`));
        }
        console.debug(`${this.constructor.name}.deleteTodoListItem: Deleting todo list item '${todoListItemId} of list ${todoListId}'`);
        let result;
        try {
            result = await this._todoListCollection.updateOne({ _id: new mongodb_1.ObjectId(todoListId) }, { $pull: { items: { _id: new mongodb_1.ObjectId(todoListItemId) } } });
        }
        catch (err) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`failed while trying to delete todo list item: '${todoListItemId}' on: ${err}`, todo_list_types_1.ERROR_CODES.DB_ERROR));
        }
        const { modifiedCount } = result;
        if (!modifiedCount) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`failed to delete item, cannot find list: ${todoListId} or item: ${todoListItemId}`, todo_list_types_1.ERROR_CODES.TODO_LIST_DOESNT_EXIST));
        }
        console.debug(`${this.constructor.name}.deleteTodoListItem: Successfully deleted todo list item '${todoListItemId} of list '${todoListId}'`);
        return Q.resolve(undefined);
    }
}
exports.TodoListMongoDal = TodoListMongoDal;
//# sourceMappingURL=todo-list-mongo-dal.js.map