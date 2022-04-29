import express from "express";

export type Config = {
    port: number,
    path: string
}

export class Application {
    private readonly express: express.Express;

    constructor(private readonly config: Config) {
        this.express = express();
        this.express.disable('x-powered-by');
        this.express.use(express.json());
    }

    async start(): Promise<void> {
        this.express.listen(this.config.port);
    }
}
