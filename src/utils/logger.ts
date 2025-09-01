class Logger {
    private logLevel: string;

    constructor(logLevel: string = "info") {
        this.logLevel = logLevel;
    }

    info(value: any) {
        console.log(value)
    }
}

export { Logger };