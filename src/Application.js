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

    // Request handler.
    handleRequest(req, res, next) {
        console.log(chalk.bold('Received request @') + chalk.underline(this.config.path) + ' with body:');
        console.dir(req.body, { depth: null });

        this.controller.handleJsonRpcRequest(req.body)
            .then((resValue) => {
                console.log(chalk.bold('Responding with:'));
                console.dir(resValue, { depth: null });
                res.status(200).send(resValue);

                next();
            });
    }

    constructor(config) {
        this.config = config;
        this.controller = null;

        this.express = express();
        this.express.disable('x-powered-by');
        this.express.use(express.json());
        this.express.use(this.handleError.bind(this));
    }

    async start() {
        console.log(chalk.bold('Starting ' + this.config.service + ' @') + chalk.underline(this.config.path));
        this.registerEvents();

        const service = await import('./service/' + this.config.service + '.js');
        this.controller = new Controller(new service.default(this.config));

        this.express.post(this.config.path, this.handleRequest.bind(this));
        this.express.listen(this.config.port);
    }

    async stop() {
        console.log(chalk.bold('Stopping all services'));
        process.exit();
    }
}
