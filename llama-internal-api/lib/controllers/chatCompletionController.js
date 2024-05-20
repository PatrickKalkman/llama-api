import logger from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

const chatCompletionController = {};

chatCompletionController.chatCompletion = async (req, reply) => {
  try {
    const {
      model,
      messages,
      max_tokens,
      temperature,
      top_p,
      n,
      stream,
      stop,
      presence_penalty,
      frequency_penalty,
      logit_bias,
      user
    } = req.body;

    // Generate a unique ID for the response
    const responseId = uuidv4();

    // Get the current timestamp in seconds
    const createdTimestamp = Math.floor(Date.now() / 1000);

    // Determine the content of the assistant's message
    let assistantContent = 'As a mock AI Assistant, I can only echo your last message, but there were no messages!';
    if (messages && messages.length > 0) {
      const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
      if (lastUserMessage) {
        assistantContent = `You said: "${lastUserMessage.content}"`;
      }
    }

    // Create the response object
    const response = {
      id: responseId,
      object: 'chat.completion',
      created: createdTimestamp,
      model,
      choices: [
        {
          message: {
            role: 'assistant',
            content: assistantContent,
          },
        },
      ],
    };

    reply.send(response);
  } catch (error) {
    logger.error(`Error in chatCompletionController.chatCompletion: ${error}`);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export default chatCompletionController;
