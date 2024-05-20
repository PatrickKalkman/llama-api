import chatCompletionController from '../controllers/chatCompletionController.js';
import { chatCompletionSchema } from '../schemas/chatCompletionSchema.js';

export default async function (fastify) {
  fastify.post('/chat/completions', {schema: chatCompletionSchema}, chatCompletionController.chatCompletion);
}