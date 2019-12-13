

export interface TodoList {
    title: string;
    items: TodoListItem[];
    userId: string;
}

export interface TodoListItem {
    name: string;
    done: boolean;
}

export interface TodoListDal {
    getTodoLists(userId: string): Promise<>
}