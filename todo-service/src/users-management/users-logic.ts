import {User, UserInput, UsersDal} from "../types/todo-list-types";
import {TodoListTypeGuard} from "../types/todo-list-type-guard";
import Q = require("q");
import Bcrypt = require("bcrypt");
import {ErrorUtils} from "../utils/error-utils";
import {HttpError} from "../errors/http-error";



export class UsersLogic {

    constructor(private _userDal: UsersDal) {}

    public async register(userInput: UserInput): Promise<void> {
        if(!TodoListTypeGuard.isUserInput(userInput)) {
            const error = new HttpError(`received invalid user input: ${ JSON.stringify(userInput) }'`, 400, "USER_INVALID_INPUT");
            return Q.reject(error);
        }
        console.log("UsersLogic.register: Adding user", userInput.name);
        try {
            userInput.password = await Q.nfcall(Bcrypt.hash, userInput.password, 10);
        } catch (e) {
            console.error("UsersLogic.register: Failed hashing user '", userInput.name, "' password on", e);
            return Q.reject(new HttpError("failed registering user", 500, "3RD_PARTY_ERROR"));
        }

        let user!: User;
        try {
            user = await this._userDal.getUser(userInput);
        } catch (e) {
            return Q.reject(new HttpError("failed retrieving user from data store", 500, "DAL_GET_ERROR"));
        }

        if (user) {
            return Q.reject(new HttpError(`user: '${userInput.name}' already exists`, 409, "USER_EXISTS_ERROR"));
        }

        try {
            await this._userDal.addUser(userInput);
            console.log("UsersLogic.register: Successfully added user", userInput.name);
        } catch (e) {
            return Q.reject(new HttpError(`user: '${userInput.name}' already exists`, 500, "DAL_ADD_ERROR"));
        }

    }
}
