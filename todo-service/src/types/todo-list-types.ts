import {ObjectId} from "mongodb";
import {MongoClient} from "mongodb";

export const TODO_LIST_DB_NAME: string = "todo";

export interface MongoDbCollection {
    init(mongoClient: MongoClient): Promise<void>;
}

export interface TodoListDal extends MongoDbCollection {
    getTodoLists(userId: string): Promise<TodoList[]>;

}

export interface MongoDocument {
    _id: ObjectId;
}

export interface TodoList extends MongoDocument {
    title: string;
    items: TodoListItem[];
    userId: ObjectId;
}

export interface TodoListInput {
    title: TodoList['title'];
    items: TodoList['items'];
    userId: TodoList['userId'];
}

export interface TodoListItem extends MongoDocument {
    name: string;
    done: boolean;
}

export interface TodoListItemInput {
    name: TodoListItem['name'];
    done: TodoListItem['done'];
}