"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todo_list_types_1 = require("../types/todo-list-types");
const error_utils_1 = require("../utils/error-utils");
const rjwt = require('restify-jwt-community');
class UsersRestService {
    constructor(_usersLogic) {
        this._usersLogic = _usersLogic;
    }
    registerRoutes(restServer, middlewares) {
        restServer.use(rjwt({ secret: todo_list_types_1.JWT_SECRET }).unless({
            path: ["/users/auth/login", "/users/register"]
        }));
        restServer.post("/users/register", this._registerUser.bind(this));
        restServer.post("/users/auth/login", this._authenticateUser.bind(this));
    }
    async _registerUser(req, res, next) {
        let error = null;
        try {
            const { userName: name, userPassword: password } = req.body;
            const user = await this._usersLogic.register({ name, password });
            res.send(201, user);
        }
        catch (e) {
            error = e;
            console.error("UsersRestService._registerUser: Failed registering user on", error.stack);
            const { message, code, httpStatus } = error_utils_1.ErrorUtils.httpErrorHandler(error);
            res.send(httpStatus, { message, code });
        }
        finally {
            next(error);
        }
    }
    async _authenticateUser(req, res, next) {
        let error = null;
        try {
            const { userName: name, userPassword: password } = req.body;
            const jwtContext = await this._usersLogic.authenticate({ name, password });
            res.send(200, jwtContext);
        }
        catch (e) {
            error = e;
            console.error("UsersRestService._authenticateUser: Failed authenticating user on", error.stack);
            const { message, code, httpStatus } = error_utils_1.ErrorUtils.httpErrorHandler(error);
            res.send(httpStatus, { message, code });
        }
        finally {
            next(error);
        }
    }
}
exports.UsersRestService = UsersRestService;
//# sourceMappingURL=users-rest-service.js.map