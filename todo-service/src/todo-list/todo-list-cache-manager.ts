import {RedisClient} from "redis";


export class TodoListCacheManager {

    constructor(private _redisClient: RedisClient) {}

}
