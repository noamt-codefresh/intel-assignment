import {RedisClient} from "redis";


export class TodoListCacheManger {

    constructor(private _redisClient: RedisClient) {}

}