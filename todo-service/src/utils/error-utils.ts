

export class ErrorUtils {

    public static createError(message: string, name?: string): Error {
        const error = new Error(message);
        if (name) {
           error.name = name;
        }
        return error;
    }

    public static getHttpStatusCode(error: Error): number {
        const errorName: string = error && error.name;
        switch (errorName) {
            case "USER_INVALID_INPUT": return 400;
            case "RESOURCE_ALREADY_EXISTS": return 409;
            default: return 500;
        }
    }


}
