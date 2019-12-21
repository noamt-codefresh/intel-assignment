import { TodoList, TodoListDal, TodoListInput, TodoListItem, TodoListItemInput } from "../types/todo-list-types";
import { MongoClient } from "mongodb";
export declare class TodoListMongoDal implements TodoListDal {
    private _todoListCollection;
    init(mongoClient: MongoClient): Promise<void>;
    getTodoLists(userId: string): Promise<TodoList[]>;
    getTodoListItems(todoListId: string): Promise<TodoListItem[]>;
    addTodoList(todoListInput: TodoListInput): Promise<TodoList>;
    addTodoListItem(todoListId: string, todoListItemInput: TodoListItemInput): Promise<TodoListItem>;
    updateTodoListItem(todoListId: string, todoListItem: TodoListItem): Promise<void>;
    deleteTodoListItem(todoListId: string, todoListItemId: string): Promise<void>;
}
