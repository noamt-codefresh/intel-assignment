"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Restify = require("restify");
const todo_list_rest_service_1 = require("./todo-list/todo-list-rest-service");
const Q = require("q");
const todo_list_types_1 = require("./types/todo-list-types");
const mongodb_1 = require("mongodb");
const todo_list_mongo_dal_1 = require("./todo-list/todo-list-mongo-dal");
const todo_list_logic_1 = require("./todo-list/todo-list-logic");
const redis_items_cache_manager_1 = require("./todo-list/redis-items-cache-manager");
const users_mongo_dal_1 = require("./users-management/users-mongo-dal");
const users_logic_1 = require("./users-management/users-logic");
const users_rest_service_1 = require("./users-management/users-rest-service");
const corsMiddleware = require('restify-cors-middleware');
const redisItemsCacheManager = new redis_items_cache_manager_1.RedisItemsCacheManager();
const restServerPort = process.env.TODO_SERVICE_PORT || "8686";
const mongodbUrl = process.env.MONGODB_URL || `mongodb://127.0.0.1:27017/${todo_list_types_1.TODO_LIST_DB_NAME}`;
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const restServer = Restify.createServer();
restServer.use(Restify.plugins.bodyParser());
restServer.use(Restify.plugins.queryParser());
const cors = corsMiddleware({
    preflightMaxAge: 5,
    origins: ['*'],
    allowHeaders: ['Authorization'],
});
restServer.pre(cors.preflight);
restServer.use(cors.actual);
// TODO: catch sigint/sigterm to end gracefully mongo/redis connections
Q.when().then(() => {
    return Q.all([
        Q.nfcall(mongodb_1.MongoClient.connect.bind(mongodb_1.MongoClient), mongodbUrl, { useUnifiedTopology: true }),
        redisItemsCacheManager.connect(redisUrl)
    ]);
}).spread((mongoClient, redisClient) => {
    const todoListMongoDal = new todo_list_mongo_dal_1.TodoListMongoDal();
    const todoListLogic = new todo_list_logic_1.TodoListLogic(todoListMongoDal, redisItemsCacheManager);
    const todoRestService = new todo_list_rest_service_1.TodoListRestService(todoListLogic);
    todoRestService.registerRoutes(restServer);
    const usersMongoDal = new users_mongo_dal_1.UsersMongoDal();
    const usersLogic = new users_logic_1.UsersLogic(usersMongoDal);
    const usersRestService = new users_rest_service_1.UsersRestService(usersLogic);
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
//# sourceMappingURL=app.js.map