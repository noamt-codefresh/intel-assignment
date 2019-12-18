import {
    CacheManager,
    ERROR_CODES, MongoDocument,
    TODO_LIST_DB_NAME,
    TodoList,
    TodoListDal,
    TodoListInput, TodoListItem, TodoListItemInput
} from "../types/todo-list-types";
import {Collection, MongoClient, ObjectId} from "mongodb";
import Q = require("q");
import {ErrorWithCode} from "../errors/error-with-code";
import _ = require("lodash");

const TODO_LIST_COLLECTION_NAME: string = "todoLists";

export class TodoListMongoDal implements TodoListDal {

    private _todoListCollection!: Collection;

    public async init(mongoClient: MongoClient): Promise<void> {
        if (!mongoClient.isConnected()) {
            return Q.reject<void>(new Error("failed to initialize UsersMongoDal, no available mongo connection"));
        }

        console.log(`${this.constructor.name}.init: initializing...`);
        try{
            this._todoListCollection = await mongoClient.db(TODO_LIST_DB_NAME).createCollection(TODO_LIST_COLLECTION_NAME);
        } catch (e) {
            return Q.reject(new Error(`failed creating ${TODO_LIST_COLLECTION_NAME} collection for db: ${TODO_LIST_DB_NAME}, received error: ${e}`));
        }

        console.log(`${this.constructor.name}.init: initialized successfully`);
    }

    public async getTodoLists(userId: string): Promise<TodoList[]> {
        if (!userId) {
            return Q.reject(new Error('data store received undefined user id'));
        }

        console.debug(`${this.constructor.name}.getTodoLists: Retrieving todo lists for user '${userId}'`);
        let todoLists;
        try {
            todoLists = await this._todoListCollection.find<TodoList>({userId}).project({userId: 0, items: 0}).toArray();
        } catch (err) {
            return Q.reject(new ErrorWithCode(`failed while trying to query todo lists with query ${{userId}} on: ${err}`, ERROR_CODES.DB_ERROR));
        }

        console.debug(`${this.constructor.name}.getTodoLists: Successfully retrieved ${_.size(todoLists)} todo lists for user ${userId}'`);
        return todoLists;
    }

    public async getTodoListItems(todoListId: string): Promise<TodoListItem[]> {
        if (!todoListId) {
            return Q.reject(new Error('data store received undefined todoList id'));
        }

        console.debug(`${this.constructor.name}.getTodoListItems: Retrieving todo lists for user '${todoListId}'`);
        let todoList;
        try {
            todoList = await this._todoListCollection.findOne<TodoList>({_id: new ObjectId(todoListId)});
        } catch (err) {
            return Q.reject(new ErrorWithCode(`failed while trying to query todo lists with query ${{todoListId}} on: ${err}`, ERROR_CODES.DB_ERROR));
        }

        if (!todoList) {
            return Q.reject(new ErrorWithCode(`cannot find list: ${todoListId}`, ERROR_CODES.TODO_LIST_DOESNT_EXIST));
        }

        console.debug(`${this.constructor.name}.getTodoListItems: Successfully retrieved list ${_.size(todoList.items)} items for list ${todoListId}'`);
        return todoList.items;
    }

    public async addTodoList(todoListInput: TodoListInput): Promise<TodoList> {
        if (!todoListInput) {
            return Q.reject(new Error('data store received undefined todo list'));
        }

        todoListInput = _.assign(todoListInput, { items: [] });
        console.debug(`${this.constructor.name}.addTodoList: Adding todo list '${todoListInput.title}' for user '${todoListInput.userId}'`);
        let result;
        try {
            result = await this._todoListCollection.insertOne(todoListInput);
        } catch (err) {
            return Q.reject(new ErrorWithCode(`failed while trying to insert todo list: '${todoListInput.title}' on: ${err}`, ERROR_CODES.DB_ERROR));
        }

        const todoList = Object.assign<TodoListInput, MongoDocument>(todoListInput, {_id: result.insertedId as ObjectId});
        // TODO: implement cache here with hmset in order to get access later when item changes and remove middle ware
        console.debug(`${this.constructor.name}.addTodoList: Successfully added todo list '${todoList.title} with id '${todoList._id.toHexString()}'`);
        return todoList as TodoList;
    }

    public async addTodoListItem(todoListId: string, todoListItemInput: TodoListItemInput): Promise<TodoListItem> {
        if (!todoListItemInput || !todoListId) {
            return Q.reject(new Error(`data store received invalid args: todo list item: ${todoListItemInput} / todo list id: ${todoListId}`));
        }

        console.debug(`${this.constructor.name}.addTodoListItem: Adding todo list item '${todoListItemInput.name}'`);
        const todoListItem = _.assign(todoListItemInput, {_id: new ObjectId()});

        let result;
        try {
            result = await this._todoListCollection.updateOne({_id: new ObjectId(todoListId)}, {$push: {items: todoListItem}});
        } catch (err) {
            return Q.reject(new ErrorWithCode(`failed while trying to insert todo list item: '${todoListItemInput.name}' on: ${err}`, ERROR_CODES.DB_ERROR));
        }

        const {matchedCount} = result;
        if (!matchedCount) {
            return Q.reject(new ErrorWithCode(`failed to add item: ${todoListItem.name}, cannot find list id: ${todoListId}`, ERROR_CODES.TODO_LIST_DOESNT_EXIST))
        }

        console.debug(`${this.constructor.name}.addTodoListItem: Successfully added todo list item '${todoListItem.name} with id '${todoListItem._id.toHexString()}'`);
        return todoListItem;
    }

    public async updateTodoListItem(todoListId: string, todoListItem: TodoListItem): Promise<void> {
        if (!todoListItem || !todoListId) {
            return Q.reject(new Error(`data store received invalid args: todo list item: ${todoListItem} / todo list id: ${todoListId}`));
        }

        console.debug(`${this.constructor.name}.updateTodoListItem: Updating todo list item '${todoListItem._id} of list ${todoListId}'`);

        todoListItem._id = new ObjectId(todoListItem._id);
        let result;
        try {
            result = await this._todoListCollection.updateOne({_id: new ObjectId(todoListId), "items._id": todoListItem._id},{$set: {"items.$": todoListItem}});
        } catch (err) {
            return Q.reject(new ErrorWithCode(`failed while trying to insert todo list item: '${todoListItem._id}' on: ${err}`, ERROR_CODES.DB_ERROR));
        }

        const {modifiedCount} = result;
        if (!modifiedCount) {
            return Q.reject(new ErrorWithCode(`failed to update item: ${todoListItem._id}, cannot find list: ${todoListId} or item`, ERROR_CODES.TODO_LIST_DOESNT_EXIST))
        }

        console.debug(`${this.constructor.name}.updateTodoListItem: Successfully updated todo list item '${todoListItem._id} of list '${todoListId}'`);
        return Q.resolve(undefined);
    }

    public async deleteTodoListItem(todoListId: string, todoListItemId: string): Promise<void> {
        if (!todoListId || !todoListItemId) {
            return Q.reject(new Error(`data store received invalid args: todo list item: ${todoListItemId} / todo list id: ${todoListId}`));
        }

        console.debug(`${this.constructor.name}.deleteTodoListItem: Deleting todo list item '${todoListItemId} of list ${todoListId}'`);

        let result;
        try {
            result = await this._todoListCollection.updateOne({_id: new ObjectId(todoListId)}, {$pull: {items: {_id: new ObjectId(todoListItemId)}}});
        } catch (err) {
            return Q.reject(new ErrorWithCode(`failed while trying to delete todo list item: '${todoListItemId}' on: ${err}`, ERROR_CODES.DB_ERROR));
        }

        const {modifiedCount} = result;
        if (!modifiedCount) {
            return Q.reject(new ErrorWithCode(`failed to delete item: ${todoListItemId}, cannot find list: ${todoListId} or item`, ERROR_CODES.TODO_LIST_DOESNT_EXIST))
        }

        console.debug(`${this.constructor.name}.deleteTodoListItem: Successfully updated todo list item '${todoListItemId} of list '${todoListId}'`);
        return Q.resolve(undefined);
    }


}
