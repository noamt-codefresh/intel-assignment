import {
    ERROR_CODES, MongoDocument,
    TODO_LIST_DB_NAME,
    TodoList,
    TodoListDal,
    TodoListInput,
    UserInput
} from "../types/todo-list-types";
import {Collection, MongoClient, ObjectId} from "mongodb";
import Q = require("q");
import {TodoListCacheManager} from "./todo-list-cache-manager";
import {ErrorWithCode} from "../errors/error-with-code";

const TODO_LIST_COLLECTION_NAME: string = "todoLists";

export class TodoListMongoDal implements TodoListDal {

    private _todoListCollection!: Collection;

    constructor(private _cacheManager: TodoListCacheManager) {}

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
        return null;
    }

    public async addTodoList(todoListInput: TodoListInput): Promise<TodoList> {
        if (!todoListInput) {
            return Q.reject(new Error('data store received undefined user'));
        }

        console.log(`${this.constructor.name}.addTodoList: Adding todo list '${todoListInput.title}' for user '${todoListInput.userId}'`);
        let result;
        try {
            result = await this._todoListCollection.insertOne(todoListInput);
        } catch (err) {
            return Q.reject(new ErrorWithCode(`failed while trying to insert todo list: '${todoListInput.title}' on: ${err}`, ERROR_CODES.DB_ERROR));
        }

        const todoList = Object.assign<TodoListInput, MongoDocument>(todoListInput, {_id: result.insertedId as ObjectId});

        console.log(`${this.constructor.name}.getUser: Successfully added todo list '${todoList.title} with id '${todoList._id.toHexString()}'`);
        return todoList;
    }




}
