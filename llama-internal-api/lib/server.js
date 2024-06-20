import process from 'process';
import pino from 'pino';
import Fastify from 'fastify';
import sensible from '@fastify/sensible';

import fastifyPrintRoutes from 'fastify-print-routes';

import registerChatCompletionRoutes from './routes/chatCompletionRoutes.js';
import { verifyToken } from './utils/verifyToken.js';

const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

const fastify = Fastify({
  logger,
});

fastify.register(fastifyPrintRoutes);
fastify.register(sensible);

const server = {};

const disableAuth = process.env.DISABLE_AUTH === 'true';

if (!disableAuth) {
  fastify.decorate('authenticate', async function (request, reply) {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        reply.unauthorized('No authorization header');
        return;
      }

      const token = authHeader.split(' ')[1];

      try {
        const tokenPayload = await verifyToken(token);
        request.user = tokenPayload;
      } catch (err) {
        fastify.log.error({ msg: 'Error verifying token', err, token });
        reply.unauthorized('Invalid token');
        return;
      }
    } catch (err) {
      fastify.log.error({ msg: 'An unexpected error occurred during authentication', err });
      reply.internalServerError('An unexpected error occurred during authentication');
    }
  });
}

fastify.register((instance, opts, next) => {
  registerChatCompletionRoutes(instance);
  next();
});

server.start = function start() {
  const port = process.env.SERVER_PORT || 8000;
  fastify.listen({ port: port, host: '0.0.0.0'  }, (err) => {
    if (!err) {
      fastify.log.info(`The http server is running and listening on port ${fastify.server.address().port}`);
    } else {
      log.error(`An error occurred while trying to start the http server. Err: ${err}`);
    }
  });
};

server.stop = function stop() {
  fastify.close((err) => {
    if (err) {
      log.error(`An error occurred while trying to close the http server. Err: ${err}`);
    }
  });
};

export default server;
