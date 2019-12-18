import Restify = require("restify");
import {TodoListRestService} from "./todo-list/todo-list-rest-service";
import Q = require("q");
import {CacheManager, TodoListDal, UsersDal} from "./types/todo-list-types";
import {MongoClient} from "mongodb";
import {TodoListMongoDal} from "./todo-list/todo-list-mongo-dal";
import {TodoListLogic} from "./todo-list/todo-list-logic";
import {TODO_LIST_DB_NAME} from "../dist/types/todo-list-types";
import {RedisCacheManager} from "./utils/redis-cache-manager";
import {UsersMongoDal} from "./users-management/users-mongo-dal";
import {UsersLogic} from "./users-management/users-logic";
import {UsersRestService} from "./users-management/users-rest-service";

const redisCacheManager: CacheManager = new RedisCacheManager();

const restServerPort = process.env.TODO_SERVICE_PORT || "8686";
const mongodbUrl = process.env.MONGODB_URL || `mongodb://127.0.0.1:27017/${TODO_LIST_DB_NAME}`;
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const restServer = Restify.createServer();
restServer.use(Restify.plugins.bodyParser());
restServer.use(Restify.plugins.queryParser());

// TODO: catch sigint/sigterm to end gracefully mongo/redis connections

Q.when().then( () => {
    return Q.all([
        Q.nfcall<MongoClient>(MongoClient.connect.bind(MongoClient), mongodbUrl, {useUnifiedTopology: true}),
        redisCacheManager.connect(redisUrl)
    ]);
}).spread((mongoClient, redisClient) => {

    const todoListMongoDal: TodoListDal = new TodoListMongoDal();
    const todoListLogic = new TodoListLogic(todoListMongoDal, redisCacheManager);
    const todoRestService = new TodoListRestService(todoListLogic);
    todoRestService.registerRoutes(restServer);

    const usersMongoDal: UsersDal = new UsersMongoDal();
    const usersLogic = new UsersLogic(usersMongoDal);
    const usersRestService = new UsersRestService(usersLogic);
    usersRestService.registerRoutes(restServer);

    return Q.all([
        todoListMongoDal.init(mongoClient),
        usersMongoDal.init(mongoClient),
        Q.nfcall(restServer.listen.bind(restServer), restServerPort)
    ]);
}).then(() => {
    console.log("main: service is up and running on port", restServerPort);
}).catch(err => {
    console.error('main: failed to start service on', err);
    process.exit(1);
});
