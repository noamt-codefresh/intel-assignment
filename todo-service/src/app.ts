import Restify from "restify";
import {TodoListRestService} from "./todo-list/todo-rest-service";
import Q = require("q");
import redis = require("redis");
import {RedisClient} from "redis";


const mongodbUrl = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017";
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const server = Restify.createServer();
server.use(Restify.plugins.bodyParser());
server.use(Restify.plugins.queryParser());

const redisClient: RedisClient = redis.createClient({url: redisUrl});
const todoListCacheManager: CacheManager = new TodoListCacheManager(redisClient);

const todoListMongoDal: TodoListDal = new TodoListMongoDal(mongodbUrl, todoListCacheManager);

const todoListLogic = TodoListLogic(mongoTodoListDal);
const todoRestService = new TodoListRestService(server, todoLodic);

// TODO: catch sigint/sigterm to end gracefully mongo/redis connections

Q.when().then(() => {
    return Q.all([mongoDbPhoneDal.connect(mongodbUrl), phoneRestService.start(phoneStoragePort)]);
}).then(() => {
    console.log("main: service is ready");
}).catch(err => {
    console.error('main: failed to start service on', err);
    process.exit(1);
});