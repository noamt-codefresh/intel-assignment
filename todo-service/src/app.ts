import Restify from "restify";
import {TodoListRestService} from "./todo-list/todo-rest-service";
import Q = require("q");
import redis = require("redis");
import {RedisClient} from "redis";
import {TodoListDal} from "./types/todo-list-types";
import {MongoClient} from "mongodb";
import {TodoListMongoDal} from "./todo-list/todo-list-mongo-dal";
import {TodoListLogic} from "./todo-list/todo-list-logic";
import {TodoListCacheManger} from "./todo-list/todo-list-cache-manger";


const mongodbUrl = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017";
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const restServer = Restify.createServer();
restServer.use(Restify.plugins.bodyParser());
restServer.use(Restify.plugins.queryParser());


const redisClient: RedisClient = redis.createClient({url: redisUrl});
const todoListCacheManager: TodoListCacheManger = new TodoListCacheManger(redisClient);

const todoListMongoDal: TodoListDal = new TodoListMongoDal(todoListCacheManager);

const todoListLogic = new TodoListLogic(todoListMongoDal);
const todoRestService = new TodoListRestService(restServer, todoListLogic);

// TODO: catch sigint/sigterm to end gracefully mongo/redis connections

Q.when().then(async () => {
    const mongoClient = await Q.nfcall(MongoClient.connect.bind(MongoClient), mongodbUrl);
    return Q.all([todoListMongoDal.init(mongoClient), phoneRestService.start(phoneStoragePort)]);
}).then(() => {
    console.log("main: service is ready");
}).catch(err => {
    console.error('main: failed to start service on', err);
    process.exit(1);
});