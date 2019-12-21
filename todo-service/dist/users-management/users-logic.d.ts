import { JwtContext, User, UserInput, UsersDal } from "../types/todo-list-types";
export declare class UsersLogic {
    private _userDal;
    constructor(_userDal: UsersDal);
    register(userInput: UserInput): Promise<User>;
    authenticate(userInput: UserInput): Promise<JwtContext>;
}
