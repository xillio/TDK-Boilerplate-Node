import { Controller } from "./controller/index.js";
import { ErrorCodes, ProtocolVersion, createErrorResponse } from "./jsonrpc/index.js";
import express from "express";
import chalk from "chalk";

export class Application {

    // Helper to handle signals.
    registerEvents() {
        process.on('SIGTERM', this.stop.bind(this));
        process.on('SIGINT', this.stop.bind(this));
    }

    // Error handler.
    handleError(err, _req, res, _next) {
        res.status(200).send(createErrorResponse(
            ProtocolVersion.V2_0,
            '', // id is unknown as this is likely a JSON parse error.
            ErrorCodes.INVALID_CONFIGURATION,
            err.message));
    }

    constructor(config) {
        this.config = config;
        this.express = express();
        this.express.disable('x-powered-by');
        this.express.use(express.json());
        this.express.use(this.handleError.bind(this));

        // TODO: What about https? Note in readme?
        // TODO: check if utf8 header is added?
    }

    async start() {
        console.log(chalk.bold('Starting ' + this.config.service + ' @') + chalk.underline(this.config.path));
        this.registerEvents();

        const service = await import('./service/' + this.config.service + '.js');
        const controller = new Controller(this.config, new service.default(this.config));

        this.express.post(this.config.path, controller.handleRequest.bind(controller));
        this.express.listen(this.config.port);
    }

    async stop() {
        console.log(chalk.bold('Stopping all services'));
        process.exit();
    }
}
