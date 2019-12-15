

export class ErrorUtils {

    public static createError(message: string, name?: string): Error {
        const error = new Error(message);
        if (name) {
           error.name = name;
        }
        return error;
    }


}
