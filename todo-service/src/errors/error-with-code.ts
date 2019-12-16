

export class ErrorWithCode extends Error {

    constructor(public message: string, public code: string) {
        super(message);
    }

    public toString() {
        return `[${this.code}] ${this.message}`;
    }

}
