import process from 'process';
import logger from './lib/utils/logger.js';
import server from './lib/server.js';

class App {
  constructor() {}

  init() {
    server.start();
  }

  shutdown() {
    server.stop();
    process.exit();
  }
}

const app = new App();

process.on('SIGINT', () => {
  logger.info('Got SIGINT, gracefully shutting down');
  app.shutdown();
});

process.on('SIGTERM', () => {
  logger.info('Got SIGTERM, gracefully shutting down');
  app.shutdown();
});

app.init();

export default app;