"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todo_list_types_1 = require("../types/todo-list-types");
const todo_list_type_guard_1 = require("../types/todo-list-type-guard");
const Q = require("q");
const Bcrypt = require("bcrypt");
const error_with_code_1 = require("../errors/error-with-code");
const jwt = require("jsonwebtoken");
class UsersLogic {
    constructor(_userDal) {
        this._userDal = _userDal;
    }
    async register(userInput) {
        if (!todo_list_type_guard_1.TodoListTypeGuard.isUserInput(userInput)) {
            const error = new error_with_code_1.ErrorWithCode(`received invalid user input: '${JSON.stringify(userInput)}'`, todo_list_types_1.ERROR_CODES.USER_INVALID_INPUT);
            return Q.reject(error);
        }
        console.log("UsersLogic.register: Adding user", userInput.name);
        try {
            userInput.password = await Q.nfcall(Bcrypt.hash, userInput.password, 10);
        }
        catch (err) {
            console.error("UsersLogic.register: Failed hashing user '", userInput.name, "' password on", err);
            return Q.reject(new error_with_code_1.ErrorWithCode("failed registering user", todo_list_types_1.ERROR_CODES.THIRD_PARTY_ERROR));
        }
        let user;
        try {
            user = await this._userDal.getUser({ name: userInput.name }); // Assuming name is unique just like an email for simplicity
        }
        catch (err) {
            if (err.code !== todo_list_types_1.ERROR_CODES.USER_DOESNT_EXIST) {
                return Q.reject(err);
            }
        }
        if (user) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`user: ${userInput.name} already exists`, todo_list_types_1.ERROR_CODES.USER_EXISTS_ERROR));
        }
        try {
            await this._userDal.addUser(userInput);
            console.log("UsersLogic.register: Successfully added user", userInput.name);
        }
        catch (err) {
            return Q.reject(err);
        }
        return user;
    }
    async authenticate(userInput) {
        if (!todo_list_type_guard_1.TodoListTypeGuard.isUserInput(userInput)) {
            const error = new error_with_code_1.ErrorWithCode(`received invalid user input: ${JSON.stringify(userInput)}'`, todo_list_types_1.ERROR_CODES.USER_INVALID_INPUT);
            return Q.reject(error);
        }
        console.log("UsersLogic.authenticate: Authenticating user", userInput.name);
        let user;
        try {
            user = await this._userDal.getUser({ name: userInput.name }); // Assuming name is unique just like an email for simplicity
        }
        catch (err) {
            return Q.reject(err);
        }
        let passwordsCompareResult = false;
        try {
            passwordsCompareResult = await Q.nfcall(Bcrypt.compare, userInput.password, user.password);
        }
        catch (err) {
            console.error("UsersLogic.authenticate: Failed comparing user '", userInput.name, "' password's hash on", err);
            return Q.reject(new error_with_code_1.ErrorWithCode("failed authenticating user", todo_list_types_1.ERROR_CODES.THIRD_PARTY_ERROR));
        }
        if (!passwordsCompareResult) {
            return Q.reject(new error_with_code_1.ErrorWithCode("failed authenticating user", todo_list_types_1.ERROR_CODES.USER_UNAUTHORIZED_ERROR));
        }
        let token = jwt.sign({ userId: user._id }, todo_list_types_1.JWT_SECRET, {
            expiresIn: '24h' // token expires in 3 hrs
        });
        console.log("UsersLogic.authenticate: User", userInput.name, "Authenticated successfully");
        // retrieve issue and expiration times
        let { iat, exp } = jwt.decode(token);
        return { iat, exp, token, userProfile: { name: user.name } };
    }
}
exports.UsersLogic = UsersLogic;
//# sourceMappingURL=users-logic.js.map