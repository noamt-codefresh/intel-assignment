import {TodoList, TodoListDal} from "../types/todo-list-types";
import {Collection, MongoClient} from "mongodb";
import Q = require("q");
import {TodoListCacheManger} from "./todo-list-cache-manger";
import {TODO_LIST_DB_NAME} from "../../dist/types/todo-list-types";

const TODO_LIST_COLLECTION_NAME: string = "todoLists";

export class TodoListMongoDal implements TodoListDal {

    private _todoListCollection!: Collection;

    constructor(private _cacheManager: TodoListCacheManger) {}

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

    getTodoLists(userId: string): Promise<TodoList[]> {
        return null;
    }


}