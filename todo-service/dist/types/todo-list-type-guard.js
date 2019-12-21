"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TodoListTypeGuard {
    static isUserInput(arg) {
        return arg && arg.name && arg.password;
    }
    static isTodoListInput(arg) {
        return arg && arg.userId && arg.title;
    }
    static isTodoListItemInput(arg) {
        return arg && arg.name && arg.done !== undefined;
    }
    static isTodoListItem(arg) {
        return arg && arg._id && TodoListTypeGuard.isTodoListItemInput(arg);
    }
}
exports.TodoListTypeGuard = TodoListTypeGuard;
//# sourceMappingURL=todo-list-type-guard.js.map