import dotenv from "dotenv";

dotenv.config();

import createApp from "./app.js";
import parentDebug from "debug";
import http from "http";
import { createMongoClient } from "./db/client.js";
import { handleError } from "./utils/error.js";
import { mergeOptions } from "./config.js";

const debug = parentDebug("book:server");
const port = normalizePort(process.env.PORT || "3000");

async function start() {
    await createMongoClient();

    mergeOptions();

    const app = createApp();

    app.set("port", port);

    const server = http.createServer(app);

    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening(server));
}

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(server) {
    return () => {
        const addr = server.address();
        const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
        debug("Listening on " + bind);
    };
}

start().catch(handleError);
