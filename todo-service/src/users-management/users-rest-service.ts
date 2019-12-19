import {JWT_SECRET, JwtContext, Routable, User} from "../types/todo-list-types";
import {Next, Request, RequestHandler, Response, Server} from "restify";
import {UsersLogic} from "./users-logic";
import {ErrorUtils} from "../utils/error-utils";
const rjwt = require('restify-jwt-community');


export class UsersRestService implements Routable {

    constructor(private _usersLogic: UsersLogic) {}

    registerRoutes(restServer: Server, middlewares?: Map<string, RequestHandler>): void {
        restServer.use(rjwt({secret: JWT_SECRET}).unless({
            path: ["/users/auth/login", "/users/register"]
        }));

        restServer.post("/users/register", this._registerUser.bind(this));
        restServer.post("/users/auth/login", this._authenticateUser.bind(this));
    }

    private async _registerUser(req: Request, res: Response, next: Next): Promise<void> {
        let error = null;
        try {
            const {userName: name, userPassword: password} = req.body;
            const user: User = await this._usersLogic.register({name, password});
            res.send(201, user);
        } catch (e) {
            error = e;
            console.error("UsersRestService._registerUser: Failed registering user on", error.stack);
            const {message, code, httpStatus} = ErrorUtils.httpErrorHandler(error);
            res.send(httpStatus, {message, code});
        } finally {
            next(error);
        }
    }

    private async _authenticateUser(req: Request, res: Response, next: Next): Promise<void> {
        let error = null;
        try {
            const {userName: name, userPassword: password} = req.body;
            const jwtContext: JwtContext = await this._usersLogic.authenticate({name, password});
            res.send(200, jwtContext);
        } catch (e) {
            error = e;
            console.error("UsersRestService._authenticateUser: Failed authenticating user on", error.stack);
            const {message, code, httpStatus} = ErrorUtils.httpErrorHandler(error);
            res.send(httpStatus, {message, code});
        } finally {
            next(error);
        }
    }

}
