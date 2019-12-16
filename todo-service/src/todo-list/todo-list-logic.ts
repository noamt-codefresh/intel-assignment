import {ERROR_CODES, TodoList, TodoListDal, TodoListInput} from "../types/todo-list-types";
import {TodoListTypeGuard} from "../types/todo-list-type-guard";
import {ErrorWithCode} from "../errors/error-with-code";
import Q = require("q");
import _ = require("lodash");
import {ObjectId} from "bson";


export class TodoListLogic {

    constructor(private _todoListDal: TodoListDal) {}

    public async addTodoList(todoListInput: TodoListInput): Promise<TodoList> {
        if(!TodoListTypeGuard.isTodoListInput(todoListInput)) {
            const error = new ErrorWithCode(`received invalid todo list input: '${ JSON.stringify(todoListInput) }'`,  ERROR_CODES.USER_INVALID_INPUT);
            return Q.reject(error);
        }

        console.log("TodoListLogic.addTodoList: Adding new todo list", todoListInput.title, "for user", todoListInput.userId);

        _.forEach(todoListInput.items, item => item._id = new ObjectId());

        let todoList: TodoList;
        try {
            todoList = await this._todoListDal.addTodoList(todoListInput);
        } catch (err) {
            return Q.reject(err);
        }


        return todoList;

    }


}