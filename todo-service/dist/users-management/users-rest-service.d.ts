import { Routable } from "../types/todo-list-types";
import { RequestHandler, Server } from "restify";
import { UsersLogic } from "./users-logic";
export declare class UsersRestService implements Routable {
    private _usersLogic;
    constructor(_usersLogic: UsersLogic);
    registerRoutes(restServer: Server, middlewares?: Map<string, RequestHandler>): void;
    private _registerUser;
    private _authenticateUser;
}
