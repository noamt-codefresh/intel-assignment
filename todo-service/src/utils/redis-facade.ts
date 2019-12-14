import redis = require("redis");
import {RedisClient} from "redis";
import Q = require("q");


export class RedisFacade {

    public static connect(redisUrl: string): Q.Promise<RedisClient> {
        return Q.Promise<RedisClient>((resolve, reject) => {
            const redisClient: RedisClient = redis.createClient({url: redisUrl});
            redisClient.on("ready", () => {
                console.log(`RedisFacade.connect: Connection established to '${redisUrl}'`);
                resolve(redisClient)
            });
            redisClient.on("error", (err) => reject(err));
        });
    }


}