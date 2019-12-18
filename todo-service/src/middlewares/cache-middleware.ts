import {Next, Request, Response} from "restify";
import {CacheManager} from "../types/todo-list-types";

const REQUEST_PREFIX: string = "requests";

export function cacheMiddleware(cacheManager: CacheManager, durationSeconds: number = 60 * 10) {

    return async (req: Request, res: Response & {sendResponse: Function}, next: Next) => {
        const userId = (req as any)?.user?.userId;
        if (!userId) {
            console.error("cacheMiddleware: Missing userId in order to create cache key");
            next();
            return;
        }

        const key = `${userId}:${REQUEST_PREFIX}:${req.method}:${req.url}`;
        try {
            const content = await cacheManager.get(key);
            if(content) {
                res.send(content);
                return;
            }
        } catch (err) {
            console.log("cacheMiddleware: Failed retrieving cache for key", key, "on", err);
            next();
            return;
        }

        res.sendResponse = res.send;
        res.send = (code: number, body: any) => {
            cacheManager.set(key, body, durationSeconds);
            res.sendResponse(code, body)
        };
        next()
    }
}
