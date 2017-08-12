/* @flow */
/* eslint-disable no-console, no-shadow */

import app from './app';
import db from './db';
import redis from './redis';

const port = process.env.PORT || 80;
const host = process.env.HOSTNAME || '0.0.0.0';

// Launch Node.js server
const server = app.listen(port, host, () => {
  console.log(`Node.js API server is listening on http://${host}:${port}/`);
});

// Shutdown Node.js app gracefully
function handleExit(options, err) {
  if (options.cleanup) {
    const actions = [server.close, db.destroy, redis.quit];
    actions.forEach((close, i) => {
      try {
        close(() => { if (i === actions.length - 1) process.exit(); });
      } catch (err) { if (i === actions.length - 1) process.exit(); }
    });
  }
  if (err) console.log(err.stack);
  if (options.exit) process.exit();
}

process.on('exit', handleExit.bind(null, { cleanup: true }));
process.on('SIGINT', handleExit.bind(null, { exit: true }));
process.on('SIGTERM', handleExit.bind(null, { exit: true }));
process.on('uncaughtException', handleExit.bind(null, { exit: true }));
