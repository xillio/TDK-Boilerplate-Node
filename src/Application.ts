import express from "express";
import chalk from "chalk";

export type Config = {
    port: number,
    path: string
}

export class Application {
    private readonly express: express.Express;

    // Helper to handle signals.
    private registerEvents(): void {
        process.on('SIGTERM', this.stop.bind(this));
        process.on('SIGINT', this.stop.bind(this));
        process.on('uncaughtException', (e) => console.error(e));
        process.on('unhandledRejection', (r) => console.error(r));
    }

    constructor(private readonly config: Config) {
        this.registerEvents();
        this.express = express();
        this.express.disable('x-powered-by');
        this.express.use(express.json());
    }

    start(): void {
        console.log('Starting @' + chalk.underline(this.config.path));
        this.express.listen(this.config.port);
    }

    stop(): void {
        console.log('Stopping @' + chalk.underline(this.config.path));
        process.exit();
    }
}
