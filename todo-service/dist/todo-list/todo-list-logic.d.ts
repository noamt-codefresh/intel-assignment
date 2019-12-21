import { TodoList, TodoListCacheManager, TodoListDal, TodoListInput, TodoListItem, TodoListItemInput } from "../types/todo-list-types";
export declare class TodoListLogic {
    private _todoListDal;
    private _todoListCacheManager;
    constructor(_todoListDal: TodoListDal, _todoListCacheManager: TodoListCacheManager);
    getTodoLists(userId: string): Promise<TodoList[]>;
    addTodoList(todoListInput: TodoListInput): Promise<TodoList>;
    getTodoListItems(todoListId: string, userId: string): Promise<TodoListItem[]>;
    addTodoListItem(todoListId: string, todoListItemInput: TodoListItemInput, userId: string): Promise<TodoListItem>;
    updateTodoListItem(todoListId: string, listItem: TodoListItem, userId: string): Promise<void>;
    deleteTodoListItem(todoListId: string, todoListItemId: string, userId: string): Promise<void>;
    private _updateTodoCache;
}
