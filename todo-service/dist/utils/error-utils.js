"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todo_list_types_1 = require("../types/todo-list-types");
class ErrorUtils {
    static httpErrorHandler(error) {
        const code = error.code || todo_list_types_1.ERROR_CODES.GENERAL_ERROR;
        let httpStatus;
        switch (code) {
            case todo_list_types_1.ERROR_CODES.USER_INVALID_INPUT:
                httpStatus = 400;
                break;
            case todo_list_types_1.ERROR_CODES.USER_EXISTS_ERROR:
                httpStatus = 409;
                break;
            case todo_list_types_1.ERROR_CODES.TODO_LIST_DOESNT_EXIST:
            case todo_list_types_1.ERROR_CODES.USER_DOESNT_EXIST:
                httpStatus = 404;
                break;
            case todo_list_types_1.ERROR_CODES.USER_UNAUTHORIZED_ERROR:
                httpStatus = 401;
                break;
            case todo_list_types_1.ERROR_CODES.THIRD_PARTY_ERROR:
            case todo_list_types_1.ERROR_CODES.DB_ERROR:
            case todo_list_types_1.ERROR_CODES.GENERAL_ERROR:
            default:
                httpStatus = 500;
                break;
        }
        return { message: error.message, code, httpStatus };
    }
}
exports.ErrorUtils = ErrorUtils;
//# sourceMappingURL=error-utils.js.map