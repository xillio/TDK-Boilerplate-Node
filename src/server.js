import { Application } from "./Application.js";

const app = new Application({
    port: 8000,
    path: '/sample-connector'
});

app.start();
