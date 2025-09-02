export class AuthError extends Error {
    status = 401

    constructor(public message: string) {
        super(message)
    }

    toResponse() {
        return Response.json({
            error: this.message,
            code: this.status
        }, {
            status: this.status
        })
    }
}