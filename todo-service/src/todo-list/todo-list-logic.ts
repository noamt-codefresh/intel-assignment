import {
    ERROR_CODES,
    TodoList,
    TodoListDal,
    TodoListInput,
    TodoListItem,
    TodoListItemInput
} from "../types/todo-list-types";
import {TodoListTypeGuard} from "../types/todo-list-type-guard";
import {ErrorWithCode} from "../errors/error-with-code";
import Q = require("q");
import _ = require("lodash");
import {ObjectId} from "bson";


export class TodoListLogic {

    constructor(private _todoListDal: TodoListDal) {}

    public async getTodoLists(userId: string): Promise<TodoList[]> {
        if(!userId) {
            return Q.reject(new ErrorWithCode("received undefined used id",  ERROR_CODES.USER_INVALID_INPUT));
        }

        console.log("TodoListLogic.getTodoLists: Retrieving todo lists for user", userId);

        let todoLists: TodoList[];
        try {
            todoLists = await this._todoListDal.getTodoLists(userId);
        } catch (err) {
            return Q.reject(err);
        }

        console.log("TodoListLogic.getTodoLists: Successfully retrieved", _.size(todoLists), "todo lists for user", userId);
        return todoLists;

    }

    public async addTodoList(todoListInput: TodoListInput): Promise<TodoList> {
        if(!TodoListTypeGuard.isTodoListInput(todoListInput)) {
            const error = new ErrorWithCode(`received invalid todo list input: '${ JSON.stringify(todoListInput) }'`,  ERROR_CODES.USER_INVALID_INPUT);
            return Q.reject(error);
        }

        console.log("TodoListLogic.addTodoList: Adding todo list", todoListInput.title, "for user", todoListInput.userId);

        let todoList: TodoList;
        try {
            todoList = await this._todoListDal.addTodoList(todoListInput);
        } catch (err) {
            return Q.reject(err);
        }

        console.log("TodoListLogic.addTodoList: Successfully added todo list", todoListInput.title, "for user", todoListInput.userId);
        return todoList;

    }

    public async addTodoListItem(todoListId: string, todoListItemInput: TodoListItemInput): Promise<TodoListItem> {
        if(!TodoListTypeGuard.isTodoListItemInput(todoListItemInput)) {
            const error = new ErrorWithCode(`received invalid todo list item input: '${ JSON.stringify(todoListItemInput) }'`,  ERROR_CODES.USER_INVALID_INPUT);
            return Q.reject(error);
        }

        console.log("TodoListLogic.addTodoListItem: Adding todo list item", todoListItemInput.name);

        let todoListItem: TodoListItem;
        try {
            todoListItem = await this._todoListDal.addTodoListItem(todoListId, todoListItemInput);
        } catch (err) {
            return Q.reject(err);
        }

        console.log("TodoListLogic.addTodoListItem: Successfully added todo list item", todoListItemInput.name);
        return todoListItem;

    }

    public async updateTodoListItem(todoListId: string, listItem: TodoListItem): Promise<void> {
        if(!TodoListTypeGuard.isTodoListItem(listItem)) {
            const error = new ErrorWithCode(`received invalid todo list item input: '${ JSON.stringify(listItem) }'`,  ERROR_CODES.USER_INVALID_INPUT);
            return Q.reject(error);
        }

        console.log("TodoListLogic.updateTodoListItem: Updating todo list item", todoListId);

        try {
            await this._todoListDal.updateTodoListItem(todoListId, listItem);
        } catch (err) {
            return Q.reject(err);
        }

        console.log("TodoListLogic.updateTodoListItem: Successfully added todo list item", todoListId);
        return Q.resolve(undefined);
    }

    public async deleteTodoListItem(todoListId: string, todoListItemId: string): Promise<void> {
        if (!todoListId || !todoListItemId) {
           return Q.reject(new ErrorWithCode(`received invalid list id: ${todoListId} or list item: ${todoListItemId}`, ERROR_CODES.USER_INVALID_INPUT));
        }

        console.log("TodoListLogic.deleteTodoListItem: deleting todo list item", todoListItemId);

        try {
            await this._todoListDal.deleteTodoListItem(todoListId, todoListItemId);
        } catch (err) {
            return Q.reject(err);
        }

        console.log("TodoListLogic.deleteTodoListItem: Successfully deleted todo list item", todoListItemId);
        return Q.resolve(undefined);

    }


}