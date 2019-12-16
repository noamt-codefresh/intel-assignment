import {
    ERROR_CODES,
    MongoDocument,
    TODO_LIST_DB_NAME,
    User,
    UserInput,
    UserQuery,
    UsersDal
} from "../types/todo-list-types";
import {Collection, MongoClient, ObjectId} from "mongodb";

import Q = require("q");
import {ErrorWithCode} from "../errors/error-with-code";

const USERS_COLLECTION_NAME: string = "users";

export class UsersMongoDal implements UsersDal {

    private _usersCollection!: Collection;

    public async init(mongoClient: MongoClient): Promise<void> {
        if (!mongoClient || !mongoClient.isConnected()) {
            return Q.reject<void>(new Error("failed to initialize UsersMongoDal, no available mongo connection"));
        }

        console.log(`${this.constructor.name}.init: Initializing...`);
        try{
            this._usersCollection = await mongoClient.db(TODO_LIST_DB_NAME).createCollection(USERS_COLLECTION_NAME);
        } catch (e) {
            return Q.reject(new Error(`failed creating ${USERS_COLLECTION_NAME} collection for db: ${TODO_LIST_DB_NAME}, received error: ${e}`));
        }

        console.log(`${this.constructor.name}.init: Initialized successfully`);
    }

    public async addUser(userInput: UserInput): Promise<User> {
        if (!userInput) {
            return Q.reject(new Error('data store received undefined user'));
        }

        console.log(`${this.constructor.name}.addUser: Adding user '${userInput.name}'`);
        let result;
        try {
            result = await this._usersCollection.insertOne(userInput);
        } catch (err) {
           return Q.reject(new ErrorWithCode(`failed while trying to insert user: '${userInput.name}' on: ${err}`, ERROR_CODES.DB_ERROR));
        }

        const user = Object.assign<UserInput, MongoDocument>(userInput, {_id: result.insertedId as ObjectId});

        console.log(`${this.constructor.name}.getUser: Successfully retrieved user '${name} with id '${user._id.toHexString()}'`);
        return user;
    }

    // Assume user name is unique just like an email for simplicity
    public async getUser(userQuery: UserQuery): Promise<User> {
        if (!userQuery) {
            return Q.reject(new Error('data store received undefined user query'));
        }

        console.log(`${this.constructor.name}.getUser: Retrieving user with query '${JSON.stringify(userQuery)}'`);

        let user;
        try {
            user = await this._usersCollection.findOne<User>(userQuery);
        } catch (err) {
            return Q.reject(new ErrorWithCode(`user retrieval failed while trying to query db with query: ${JSON.stringify(userQuery)} on: ${err}`, ERROR_CODES.DB_ERROR));
        }

        if (!user) {
            return Q.reject(new ErrorWithCode(`cannot find user in data store for query: ${JSON.stringify(userQuery)}`, ERROR_CODES.USER_DOESNT_EXIST));
        }

        console.log(`${this.constructor.name}.getUser: Successfully retrieved user '${user.name} with id '${user._id.toHexString()}'`);
        return user;
    }

}
