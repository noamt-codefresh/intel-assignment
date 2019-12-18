import {ERROR_CODES, JWT_SECRET, JwtContext, User, UserInput, UsersDal} from "../types/todo-list-types";
import {TodoListTypeGuard} from "../types/todo-list-type-guard";
import Q = require("q");
import Bcrypt = require("bcrypt");
import {ErrorWithCode} from "../errors/error-with-code";
import jwt = require("jsonwebtoken");


export class UsersLogic {

    constructor(private _userDal: UsersDal) {}

    public async register(userInput: UserInput): Promise<User> {
        if(!TodoListTypeGuard.isUserInput(userInput)) {
            const error = new ErrorWithCode(`received invalid user input: '${ JSON.stringify(userInput) }'`,  ERROR_CODES.USER_INVALID_INPUT);
            return Q.reject(error);
        }
        console.log("UsersLogic.register: Adding user", userInput.name);
        try {
            userInput.password = await Q.nfcall(Bcrypt.hash, userInput.password, 10);
        } catch (err) {
            console.error("UsersLogic.register: Failed hashing user '", userInput.name, "' password on", err);
            return Q.reject(new ErrorWithCode("failed registering user",  ERROR_CODES.THIRD_PARTY_ERROR));
        }

        let user!: User;
        try {
            user = await this._userDal.getUser({name: userInput.name}); // Assuming name is unique just like an email for simplicity
        } catch (err) {
            if (err.code !== ERROR_CODES.USER_DOESNT_EXIST) {
                return Q.reject(err);
            }
        }

        if (user) {
            return Q.reject(new ErrorWithCode(`user: ${userInput.name} already exists`,  ERROR_CODES.USER_EXISTS_ERROR));
        }

        try {
            await this._userDal.addUser(userInput);
            console.log("UsersLogic.register: Successfully added user", userInput.name);
        } catch (err) {
            return Q.reject(err);
        }
        return user;
    }

    public async authenticate(userInput: UserInput): Promise<JwtContext> {
        if(!TodoListTypeGuard.isUserInput(userInput)) {
            const error = new ErrorWithCode(`received invalid user input: ${ JSON.stringify(userInput) }'`,  ERROR_CODES.USER_INVALID_INPUT);
            return Q.reject(error);
        }

        let user: User;
        try {
            user = await this._userDal.getUser({name: userInput.name}); // Assuming name is unique just like an email for simplicity
        } catch (err) {
            return Q.reject(err);
        }

        let passwordsCompareResult: boolean = false;
        try {
            passwordsCompareResult = await Q.nfcall(Bcrypt.compare, userInput.password, user.password);
        } catch (err) {
            console.error("UsersLogic.authenticate: Failed comparing user '", userInput.name, "' password's hash on", err);
            return Q.reject(new ErrorWithCode("failed authenticating user",  ERROR_CODES.THIRD_PARTY_ERROR));
        }

        if (!passwordsCompareResult) {
            return Q.reject(new ErrorWithCode("failed authenticating user",  ERROR_CODES.USER_UNAUTHORIZED_ERROR))
        }

        let token = jwt.sign({userId: user._id}, JWT_SECRET, {
            expiresIn: '24h' // token expires in 3 hrs
        });

        // retrieve issue and expiration times
        let { iat, exp } = jwt.decode(token);
        return { iat, exp, token };
    }
}
