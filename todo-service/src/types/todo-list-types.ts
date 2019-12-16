import {ObjectId, MongoClient} from "mongodb";
import {Server} from "restify";

export const TODO_LIST_DB_NAME: string = "todo";

export const JWT_SECRET: string = "!@!@!super-secret-shhh!@!@!@";

export interface Routable {
    registerRoutes(restServer: Server): void
}

export interface MongoDbCollectionInit {
    init(mongoClient: MongoClient): Promise<void>;
}

export interface TodoListDal extends MongoDbCollectionInit {
    getTodoLists(userId: string): Promise<TodoList[]>;
    addTodoList(todoListInput: TodoListInput): Promise<TodoList>;
}

export interface UsersDal extends MongoDbCollectionInit {
   addUser(user: UserInput): Promise<User>;
   getUser(userQuery: UserQuery): Promise<User>;
}

export interface MongoDocument {
    _id: ObjectId;
}

export interface TodoList extends MongoDocument {
    title: string;
    items: TodoListItem[];
    userId: ObjectId;
}

export interface TodoListInput {
    title: TodoList['title'];
    items: TodoList['items'];
    userId: TodoList['userId'];
}

export interface TodoListItem extends MongoDocument {
    name: string;
    done: boolean;
}

export interface TodoListItemInput {
    name: TodoListItem['name'];
    done: TodoListItem['done'];
}

export interface User extends MongoDocument{
    name: string;
    password: string;
}

export interface UserInput {
    name: User['name'];
    password: User['password'];
}

export interface UserQuery {
    _id?: string;
    name?: User['name'];
    password?: User['password'];
}

export interface JwtContext {
    iat: string;
    exp: number;
    token: string;
}

export enum ERROR_CODES {
    GENERAL_ERROR = "GENERAL_ERROR",

    USER_INVALID_INPUT = "USER_INVALID_INPUT",
    USER_UNAUTHORIZED_ERROR = "USER_UNAUTHORIZED_ERROR",
    USER_EXISTS_ERROR = "USER_EXISTS_ERROR",
    USER_DOESNT_EXIST = "USER_DOESNT_EXIST",

    THIRD_PARTY_ERROR = "THIRD_PARTY_ERROR",

    DB_ERROR = "DB_ERROR"
}
