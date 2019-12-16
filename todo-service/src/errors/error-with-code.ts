

export class ErrorWithCode extends Error {

    constructor(public message: string, public code: string) {
        super(message);
    }

}
