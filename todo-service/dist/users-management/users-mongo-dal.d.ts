import { User, UserInput, UserQuery, UsersDal } from "../types/todo-list-types";
import { MongoClient } from "mongodb";
export declare class UsersMongoDal implements UsersDal {
    private _usersCollection;
    init(mongoClient: MongoClient): Promise<void>;
    addUser(userInput: UserInput): Promise<User>;
    getUser(userQuery: UserQuery): Promise<User>;
}
