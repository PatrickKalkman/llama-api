export const chatCompletionSchema = {
    body: {
      type: 'object',
      required: ['model', 'messages'],
      properties: {
        model: { type: 'string' },
        messages: {
          type: 'array',
          items: {
            type: 'object',
            required: ['role', 'content'],
            properties: {
              role: { type: 'string' },
              content: { type: 'string' },
              name: { type: 'string' } // Optional name property
            }
          }
        },
        max_tokens: { type: 'integer' },
        temperature: { type: 'number' },
        top_p: { type: 'number' },
        n: { type: 'integer' },
        stream: { type: 'boolean' },
        stop: { type: ['string', 'array'], items: { type: 'string' } },
        presence_penalty: { type: 'number' },
        frequency_penalty: { type: 'number' },
        logit_bias: { type: 'object' },
        user: { type: 'string' }
      }
    }
  };