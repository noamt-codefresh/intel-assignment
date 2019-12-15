import {TODO_LIST_DB_NAME, User, UserInput, UsersDal} from "../types/todo-list-types";
import {Collection, MongoClient} from "mongodb";

import Q = require("q");

const USERS_COLLECTION_NAME: string = "users";

export class UsersMongoDal implements UsersDal {

    private _usersCollection!: Collection;

    public async init(mongoClient: MongoClient): Promise<void> {
        if (!mongoClient.isConnected()) {
            return Q.reject<void>(new Error("failed to initialize UsersMongoDal, no available mongo connection"));
        }

        console.log(`${this.constructor.name}.init: initializing...`);
        try{
            this._usersCollection = await mongoClient.db(TODO_LIST_DB_NAME).createCollection(USERS_COLLECTION_NAME);
        } catch (e) {
            return Q.reject(new Error(`failed creating ${USERS_COLLECTION_NAME} collection for db: ${TODO_LIST_DB_NAME}, received error: ${e}`));
        }

        console.log(`${this.constructor.name}.init: initialized successfully`);
    }

    public addUser(user: UserInput): Promise<User> {
        return null;
    }

    public getUser(user: UserInput): Promise<User> {
        return undefined;
    }

}
