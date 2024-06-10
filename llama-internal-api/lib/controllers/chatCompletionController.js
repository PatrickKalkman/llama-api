import logger from '../utils/logger.js';
import axios from 'axios';
import { pipeline } from 'stream';
import { promisify } from 'util';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
});

const pipelineAsync = promisify(pipeline);

const chatCompletionController = {};

chatCompletionController.chatCompletion = async (req, reply) => {
  try {
    const response = await axiosInstance.post('/chat/completions', req.body, {
      responseType: 'stream',
    });

    logger.info('Request successfully processed by llama_cpp service');

    reply.raw.writeHead(response.status, {
      'Content-Type': response.headers['content-type'],
      'Transfer-Encoding': 'chunked',
    });

    await pipelineAsync(response.data, reply.raw);

  } catch (error) {
    logger.error(`Error in chatCompletionController.chatCompletion: ${error.message}`);

    if (error.response) {
      reply.send(reply.httpErrors.createError(error.response.status, {
        message: error.response.data.error || 'Error from llama_cpp service',
      }));
    } else if (error.code === 'ECONNREFUSED') {
      reply.serviceUnavailable();
    } else {
      reply.internalServerError();
    }
  }
}

export default chatCompletionController;
