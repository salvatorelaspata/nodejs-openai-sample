import fp from 'fastify-plugin'
const { Configuration, OpenAIApi } = await import('openai');

export default fp(async (app, opts) => {
// create configuration
const configuration = new Configuration({
    apiKey: app.config.OPENAI_API_KEY,
});
// create openai api
const openai = new OpenAIApi(configuration);
// create generate image function
const generateImage = async ({size = 'large', prompt}) => {
    const imageSize =
    size === 'small' ? '256x256' : size === 'medium' ? '512x512' : '1024x1024';
    try {
        const response = await openai.createImage({
            prompt,
            n: 1,
            size: imageSize,
        });
        const {url} = response.data.data[0];
        return url
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
        throw new Error(error.message);
    }
}
// create generate text function
const generateText = async ({prompt}) => {
    try {
        const response = await openai.createCompletion({
            prompt,
            model: 'davinci',
            n: 3,
            max_tokens: 150,
            echo: true,
            stop: ['\n', '###']
        });
        const {text} = response.data.choices[0];
        return text
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
        throw new Error(error.message);
    }
}

// decorate fastify instance with generate image function
app.decorate('generateImage', generateImage);
app.decorate('generateText', generateText);
});