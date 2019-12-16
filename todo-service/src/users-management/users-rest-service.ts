import {JwtContext, Routable} from "../types/todo-list-types";
import {Next, Request, Response, Server} from "restify";
import {UsersLogic} from "./users-logic";
import {ErrorUtils} from "../utils/error-utils";
const rjwt = require('restify-jwt-community');


export class UsersRestService implements Routable {

    constructor(private _usersLogic: UsersLogic) {}

    registerRoutes(restServer: Server): void {
        restServer.use(rjwt({secret: "!@!@!super-secret-shhh!@!@!@"}).unless({
            path: ['/auth']
        }));

        restServer.post("/register", this._registerUser.bind(this));
        restServer.post("/auth", this._authenticateUser.bind(this));
    }

    private async _registerUser(req: Request, res: Response, next: Next): Promise<void> {
        let error = null;
        try {
            const {userName: name, userPassword: password} = req.body;
            await this._usersLogic.register({name, password});
            res.send(201);
        } catch (e) {
            error = e;
            const {message, code} = ErrorUtils.httpErrorHandler(error);
            res.send(code, message);
        } finally {
            next(error);
        }
    }

    private async _authenticateUser(req: Request, res: Response, next: Next): Promise<JwtContext> {

    }

}
