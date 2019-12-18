import redis = require("redis");
import {RedisClient} from "redis";
import {CacheManager, ERROR_CODES} from "../types/todo-list-types";
import Q = require("q");
import {ErrorWithCode} from "../errors/error-with-code";


export class RedisCacheManager implements CacheManager {

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

    public async get<T>(key: string): Promise<T> {
       if (!key) {
           return Q.reject(new Error("received undefined cache key"));
       }

       let result: any;
       try {
           result = await Q.nfcall(this._redisClient.get.bind(this._redisClient), key);
           result = JSON.parse(result);
       } catch (err) {
          return Q.reject(new ErrorWithCode(`failed retrieving cache with key: ${key} on: ${err}`, ERROR_CODES.REDIS_ERROR));
       }

       return result;
    }

    public async set<T>(key: string, content: T, ttl?: number): Promise<void> {
        if (!key || !content) {
            return Q.reject(new Error(`received invalid args: key '${key}' / content '${content}'`));
        }

        let result;
        try {
            result = await Q.nfcall(this._redisClient.set.bind(this._redisClient), key, JSON.stringify(content), "EX", ttl);
        } catch (err) {
            return Q.reject(new ErrorWithCode(`failed retrieving cache with key: ${key} on: ${err}`, ERROR_CODES.REDIS_ERROR));
        }

        if (result !== "OK"){
            return Q.reject(new ErrorWithCode(`failed retrieving cache with key: ${key}, received result: ${JSON.stringify(result)}`, ERROR_CODES.REDIS_ERROR));
        }

        return Q.resolve(undefined);

    }

}
