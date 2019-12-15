import {User, UserInput, UsersDal} from "../types/todo-list-types";
import {TodoListTypeGuard} from "../types/todo-list-type-guard";
import Q = require("q");
import Bcrypt = require("bcrypt");
import {ErrorUtils} from "../utils/error-utils";



export class UsersLogic {

    constructor(private _userDal: UsersDal) {}

    public async register(userInput: UserInput): Promise<void> {
        if(!TodoListTypeGuard.isUserInput(userInput)) {
            const error = ErrorUtils.createError(`received invalid user input: ${ JSON.stringify(userInput) }'`, "USER_INVALID_INPUT");
            return Q.reject(error);
        }
        try {
            userInput.password = await Q.nfcall(Bcrypt.hash, userInput.password, 10);
        } catch (e) {
            console.error("UsersLogic.register: Failed hashing user '", userInput.name, "' password on", e);
            return Q.reject(new Error("failed registering user"));
        }

        let user!: User;
        try {
            user = await this._userDal.getUser(userInput);
        } catch (e) {

        }

        if (user) {
            return Q.reject(ErrorUtils.createError("user already exists", "RESOURCE_ALREADY_EXISTS"))
        }

    }
}
