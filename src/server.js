import { Application } from "./Application.js";

const app = new Application({
    port: 8000,
    path: '/sample-connector',
    service: 'FileService'
});

app.start();
