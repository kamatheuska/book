import dotenv from 'dotenv'

dotenv.config();

import app from './app.js';
import parentDebug from 'debug'
import http from 'http';
import { createMongoClient } from './db/client.js';
import { handleError } from './utils/error.js';

const debug = parentDebug('book:server');
const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

const server = http.createServer(app);

async function start() {
  await createMongoClient();

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
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
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


start().catch(handleError);