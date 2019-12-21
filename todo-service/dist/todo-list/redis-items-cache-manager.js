"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis = require("redis");
const todo_list_types_1 = require("../types/todo-list-types");
const Q = require("q");
const error_with_code_1 = require("../errors/error-with-code");
const _ = require("lodash");
const CACHE_TTL = 60 * 10;
class RedisItemsCacheManager {
    connect(redisUrl) {
        return new Promise((resolve, reject) => {
            this._redisClient = redis.createClient({ url: redisUrl });
            this._redisClient.on("ready", () => {
                console.log(`RedisFacade.connect: Connection established to '${redisUrl}'`);
                resolve();
            });
            this._redisClient.on("error", (err) => reject(err));
        });
    }
    async create(key, todoListItems, ttl = CACHE_TTL) {
        if (!key || !todoListItems) {
            return Q.reject(new Error(`received invalid args: key '${key}' / todoListItem '${todoListItems}'`));
        }
        const todoListItemsObj = _.reduce(todoListItems, (current, item) => {
            current[item._id.toHexString()] = JSON.stringify(item);
            return current;
        }, {});
        const commands = [
            ["HMSET", key, todoListItemsObj],
            ["EXPIRE", key, ttl],
        ];
        let result;
        try {
            const multi = this._redisClient.multi(commands);
            result = await Q.nfcall(multi.exec.bind(multi));
        }
        catch (err) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`failed setting cache for key: ${key} on: ${err}`, todo_list_types_1.ERROR_CODES.REDIS_ERROR));
        }
        if (result[0] !== "OK") {
            return Q.reject(new error_with_code_1.ErrorWithCode(`failed setting cache for key: ${key}, received result: ${JSON.stringify(result)}`, todo_list_types_1.ERROR_CODES.REDIS_ERROR));
        }
        return Q.resolve(undefined);
    }
    async get(key) {
        if (!key) {
            return Q.reject(new Error("received undefined cache key"));
        }
        let todolistItems;
        try {
            const result = await Q.nfcall(this._redisClient.hgetall.bind(this._redisClient), key);
            if (result === null) {
                return result;
            }
            todolistItems = _.reduce(result, (currentItems, item) => {
                currentItems.push(JSON.parse(item));
                return currentItems;
            }, []);
        }
        catch (err) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`failed retrieving cache with key: ${key} on: ${err}`, todo_list_types_1.ERROR_CODES.REDIS_ERROR));
        }
        return todolistItems;
    }
    async update(key, todoListItem, ttl = CACHE_TTL) {
        if (!key || !todoListItem) {
            return Q.reject(new Error(`received invalid args: key '${key}' / todoListItem '${todoListItem}'`));
        }
        try {
            const isKeyExists = await Q.nfcall(this._redisClient.exists.bind(this._redisClient), key);
            if (!isKeyExists) {
                return Q.resolve(undefined);
            }
            const commands = [
                ["HSET", key, todoListItem._id.toHexString(), JSON.stringify(todoListItem)],
                ["EXPIRE", key, ttl],
            ];
            const multi = this._redisClient.multi(commands);
            await Q.nfcall(multi.exec.bind(multi));
        }
        catch (err) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`failed setting cache for key: ${key} on: ${err}`, todo_list_types_1.ERROR_CODES.REDIS_ERROR));
        }
    }
    async delete(key) {
        if (!key) {
            return Q.reject(new Error(`received invalid args: key '${key}'`));
        }
        let result;
        try {
            result = await Q.nfcall(this._redisClient.del.bind(this._redisClient), key);
        }
        catch (err) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`failed deleting cache for key: ${key} on: ${err}`, todo_list_types_1.ERROR_CODES.REDIS_ERROR));
        }
        console.log(result);
    }
    async deleteHashField(key, field) {
        if (!key || !field) {
            return Q.reject(new Error(`received invalid args: key '${key} / todo list item id ${field}'`));
        }
        try {
            await Q.nfcall(this._redisClient.hdel.bind(this._redisClient), key, field);
        }
        catch (err) {
            return Q.reject(new error_with_code_1.ErrorWithCode(`failed deleting cache for key: ${key} on: ${err}`, todo_list_types_1.ERROR_CODES.REDIS_ERROR));
        }
    }
}
exports.RedisItemsCacheManager = RedisItemsCacheManager;
//# sourceMappingURL=redis-items-cache-manager.js.map