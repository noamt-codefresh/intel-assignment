

export class HttpError extends Error {

    constructor(public message: string, public httpStatusCode: number, public name: string) {
        super(message);
        if (httpStatusCode != null) {
            this.httpStatusCode = 500;
        }
    }

}