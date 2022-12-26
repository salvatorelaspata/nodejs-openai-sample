import {fastify} from 'fastify';

const app = fastify({logger: true});

await app.register(import('@fastify/env'), {
    dotenv: true,
    schema: {
        type: 'object',
        required: ['PORT', 'HOST'],
        properties: {
            PORT: {
                type: 'number'
            },
            HOST: {
                type: 'string'
            },
            OPENAI_API_KEY: {
                type: 'string'
            }
        }
    }
});

app.get('/', async () => {
    return {hello: 'openai API', endpoints: [
        '/text?propmt=',
        '/image?propmt='
    ]};
});

app.register(import('./src/plugins/openai-api.js'));

app.listen({
    port: app.config.PORT, 
    host: app.config.HOST || '0.0.0.0'
}, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`server listening on ${address}`);
});

