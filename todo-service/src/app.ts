import Restify = require("restify");
import {TodoListRestService} from "./todo-list/todo-list-rest-service";
import Q = require("q");

import {TodoListDal} from "./types/todo-list-types";
import {MongoClient} from "mongodb";
import {TodoListMongoDal} from "./todo-list/todo-list-mongo-dal";
import {TodoListLogic} from "./todo-list/todo-list-logic";
import {TodoListCacheManger} from "./todo-list/todo-list-cache-manger";
import {TODO_LIST_DB_NAME} from "../dist/types/todo-list-types";
import {RedisFacade} from "./utils/redis-facade";

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
        RedisFacade.connect(redisUrl)
    ]);
}).spread((mongoClient, redisClient) => {

    const todoListCacheManager: TodoListCacheManger = new TodoListCacheManger(redisClient);

    const todoListMongoDal: TodoListDal = new TodoListMongoDal(todoListCacheManager);

    const todoListLogic = new TodoListLogic(todoListMongoDal);
    const todoRestService = new TodoListRestService(todoListLogic);
    todoRestService.registerRoutes(restServer);

    return Q.all([
        todoListMongoDal.init(mongoClient),
        Q.nfcall(restServer.listen.bind(restServer), restServerPort)
    ]);
}).then(() => {
    console.log("main: service is up and running on port", restServerPort);
}).catch(err => {
    console.error('main: failed to start service on', err);
    process.exit(1);
});