import fp from 'fastify-plugin'
// create fastify plugin
export default fp(async (app, opts) => {
    app.register(import('../client/openai-client.js'))
    // add generate image function to app
    app.get('/image', async (request, reply) => {
        const {size, prompt} = request.query;
        const url = await app.generateImage({size, prompt});
        reply.redirect(303,
            url
        );
    });
    // add generate text function to app
    app.get('/text', async (request, reply) => {
        const {prompt} = request.query;
        const text = await app.generateText({prompt});
        reply.send(text);
    })
});