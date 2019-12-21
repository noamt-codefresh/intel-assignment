"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todo_list_types_1 = require("../types/todo-list-types");
const Q = require("q");
const error_with_code_1 = require("../errors/error-with-code");
const USERS_COLLECTION_NAME = "users";
class UsersMongoDal {
    async init(mongoClient) {
        if (!mongoClient || !mongoClient.isConnected()) {
            return Q.reject(new Error("failed to initialize UsersMongoDal, no available mongo connection"));
        }
        console.log(`${this.constructor.name}.init: Initializing...`);
        try {
            this._usersCollection = await mongoClient.db(todo_list_types_1.TODO_LIST_DB_NAME).createCollection(USERS_COLLECTION_NAME);
        }
        catch (e) {
            return Q.reject(new Error(`failed creating ${USERS_COLLECTION_NAME} collection for db: ${todo_list_types_1.TODO_LIST_DB_NAME}, received error: ${e}`));
        }
        console.log(`${this.constructor.name}.init: Initialized successfully`);
    }
    async addUser(userInput) {
        if (!userInput) {
            return Q.reject(new Error('data store received undefined user'));
        }
        console.log(`${this.constructor.name}.addUser: Adding user '${userInput.name}'`);
        let result;
        try {
            result = await this._usersCollection.insertOne(userInput);
        }
        catch (err) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`failed while trying to insert user: '${userInput.name}' on: ${err}`, todo_list_types_1.ERROR_CODES.DB_ERROR));
        }
        const user = Object.assign(userInput, { _id: result.insertedId });
        console.log(`${this.constructor.name}.getUser: Successfully retrieved user '${user.name} with id '${user._id.toHexString()}'`);
        return user;
    }
    // Assume user name is unique just like an email for simplicity
    async getUser(userQuery) {
        if (!userQuery) {
            return Q.reject(new Error('data store received undefined user query'));
        }
        console.log(`${this.constructor.name}.getUser: Retrieving user with query '${JSON.stringify(userQuery)}'`);
        let user;
        try {
            user = await this._usersCollection.findOne(userQuery);
        }
        catch (err) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`user retrieval failed while trying to query db with query: ${JSON.stringify(userQuery)} on: ${err}`, todo_list_types_1.ERROR_CODES.DB_ERROR));
        }
        if (!user) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`cannot find user in data store for query: ${JSON.stringify(userQuery)}`, todo_list_types_1.ERROR_CODES.USER_DOESNT_EXIST));
        }
        console.log(`${this.constructor.name}.getUser: Successfully retrieved user '${user.name} with id '${user._id.toHexString()}'`);
        return user;
    }
}
exports.UsersMongoDal = UsersMongoDal;
//# sourceMappingURL=users-mongo-dal.js.map