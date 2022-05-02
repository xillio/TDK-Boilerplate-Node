import express from "express";
import chalk from "chalk";

export class Application {
    // Helper to handle signals.
    registerEvents() {
        process.on('SIGTERM', this.stop.bind(this));
        process.on('SIGINT', this.stop.bind(this));
        process.on('uncaughtException', (e) => console.error(e));
        process.on('unhandledRejection', (r) => console.error(r));
    }

    constructor(config) {
        this.registerEvents();
        this.config = config;
        this.express = express();
        this.express.disable('x-powered-by');
        this.express.use(express.json());
    }

    start() {
        console.log('Starting @' + chalk.underline(this.config.path));
        this.express.listen(this.config.port);
    }

    stop() {
        console.log('Stopping @' + chalk.underline(this.config.path));
        process.exit();
    }
}
