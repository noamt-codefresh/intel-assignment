import { TodoListCacheManager, TodoListItem } from "../types/todo-list-types";
export declare class RedisItemsCacheManager implements TodoListCacheManager {
    private _redisClient;
    connect(redisUrl: string): Promise<void>;
    create(key: string, todoListItems: TodoListItem[], ttl?: number): Promise<void>;
    get(key: string): Promise<TodoListItem[]>;
    update(key: string, todoListItem: TodoListItem, ttl?: number): Promise<void>;
    delete<TodoList>(key: string): Promise<void>;
    deleteHashField<TodoList>(key: string, field: string): Promise<void>;
}
