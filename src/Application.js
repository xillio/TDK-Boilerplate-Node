import { Controller } from "./controller/index.js";
import { ErrorCodes, JsonRpcProtocolVersion, createErrorResponse } from "./http/index.js";
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

    // Error handler.
    handleError(err, _req, res, _next) {
        res.status(200).send(createErrorResponse(
            JsonRpcProtocolVersion.V2_0,
            '', // id is unknown as this is likely a JSON parse error.
            ErrorCodes.INVALID_QUERY,
            'Invalid request body',
            { reason: err.message }));
    }

    // Request handler.
    handleRequest(req, res, next) {
        console.log('Received request @' + chalk.underline(this.config.path) + ' with body:');
        console.dir(req.body, { depth: null });
        this.controller.handleJsonRpcRequest(req, res);
        next();
    }

    constructor(config) {
        this.config = config;

        this.express = express();
        this.express.disable('x-powered-by');
        this.express.use(express.json());
        this.express.use(this.handleError.bind(this));

        this.controller = new Controller();
        this.express.post(this.config.path, this.handleRequest.bind(this));
    }

    start() {
        console.log('Starting @' + chalk.underline(this.config.path));
        this.registerEvents();
        this.express.listen(this.config.port);
    }

    stop() {
        console.log('Stopping @' + chalk.underline(this.config.path));
        process.exit();
    }
}
