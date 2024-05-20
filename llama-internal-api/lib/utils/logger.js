import pino from 'pino';

const transport = pino.transport({
    target: 'pino-pretty',
})

export default pino(transport);
