import redis = require("redis");
import {RedisClient} from "redis";
import {CacheManager, ERROR_CODES, TodoListItem} from "../types/todo-list-types";
import Q = require("q");
import {ErrorWithCode} from "../errors/error-with-code";
import _ = require("lodash");


export class TodoListCacheManager implements CacheManager<TodoListItem> {

    private _redisClient!: RedisClient;

    public connect(redisUrl: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._redisClient = redis.createClient({url: redisUrl});
            this._redisClient.on("ready", () => {
                console.log(`RedisFacade.connect: Connection established to '${redisUrl}'`);
                resolve();
            });
            this._redisClient.on("error", (err) => reject(err));
        });
    }

    public async get(key: string): Promise<TodoListItem[]> {
       if (!key) {
           return Q.reject(new Error("received undefined cache key"));
       }

       let todolistItems: TodoListItem[];
       try {
           const result: any = await Q.nfcall(this._redisClient.hgetall.bind(this._redisClient), key);
           if (result === null) {
               return result;
           }

           todolistItems = _.reduce(result, (currentItems: TodoListItem[], item: string) => {
               currentItems.push(JSON.parse(item));
               return currentItems;
           }, []);

       } catch (err) {
          return Q.reject(new ErrorWithCode(`failed retrieving cache with key: ${key} on: ${err}`, ERROR_CODES.REDIS_ERROR));
       }

       return todolistItems;
    }

    public async set(key: string, todoListItem: TodoListItem, ttl?: number): Promise<void> {
        if (!key || !todoListItem) {
            return Q.reject(new Error(`received invalid args: key '${key}' / todoListItem '${todoListItem}'`));
        }

        let result;
        try {
            const isKeyExists = await Q.nfcall(this._redisClient.exists.bind(this._redisClient), key);
            if (!isKeyExists){
                return Q.resolve(undefined);
            }
            result = await Q.nfcall(this._redisClient.hset.bind(this._redisClient), key, todoListItem._id.toHexString(), JSON.stringify(todoListItem));
        } catch (err) {
            return Q.reject(new ErrorWithCode(`failed setting cache for key: ${key} on: ${err}`, ERROR_CODES.REDIS_ERROR));
        }

        if (result !== 1){
            return Q.reject(new ErrorWithCode(`failed setting cache for key: ${key}, received result: ${JSON.stringify(result)}`, ERROR_CODES.REDIS_ERROR));
        }

        return Q.resolve(undefined);

    }

    public async setMulti(key: string, todoListItems: TodoListItem[], ttl: number = 10 * 60) {
        if (!key || !todoListItems) {
            return Q.reject(new Error(`received invalid args: key '${key}' / todoListItem '${todoListItem}'`));
        }

        const todoListItemsObj = _.reduce(todoListItems, (current: any, item) => {
            current[item._id.toHexString()] = JSON.stringify(item);
            return current;
        }, {});

        const commands = [
            ["HMSET", key, todoListItemsObj],
            ["EXPIRE", key, ttl],
        ];
        let result: any[];
        try {
            const multi = this._redisClient.multi(commands);
            result = await Q.nfcall(multi.exec.bind(multi));
        } catch (err) {
            return Q.reject(new ErrorWithCode(`failed setting cache for key: ${key} on: ${err}`, ERROR_CODES.REDIS_ERROR));
        }

        if (result[0] !== "OK"){
            return Q.reject(new ErrorWithCode(`failed setting cache for key: ${key}, received result: ${JSON.stringify(result)}`, ERROR_CODES.REDIS_ERROR));
        }

        return Q.resolve(undefined);
    }

    public async delete<TodoList>(key: string, todoListItemId: string): Promise<void> {
        if (!key) {
            return Q.reject(new Error(`received invalid args: key '${key}'`));
        }
        let result;
        try {
            result = await Q.nfcall(this._redisClient.del.bind(this._redisClient), key);
        } catch (err) {
            return Q.reject(new ErrorWithCode(`failed deleting cache for key: ${key} on: ${err}`, ERROR_CODES.REDIS_ERROR));
        }

        console.log(result);

    }

    public async deleteHashField<TodoList>(key: string, field: string): Promise<void> {
        if (!key || !field) {
            return Q.reject(new Error(`received invalid args: key '${key} / todo list item id ${field}'`));
        }
        let result;
        try {
            result = await Q.nfcall(this._redisClient.hdel.bind(this._redisClient), key, field);
        } catch (err) {
            return Q.reject(new ErrorWithCode(`failed deleting cache for key: ${key} on: ${err}`, ERROR_CODES.REDIS_ERROR));
        }

        console.log(result);

    }

}
