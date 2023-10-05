import {NestFactory} from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import {GatewayModule} from "./gateway.module";

let server;

async function bootstrap(): Promise<any> {
    const app = await NestFactory.create(GatewayModule, {
        logger: ['error', 'warn', 'log']
    });
    app.use((req, res, next) => {
        res.header('X-Custom-Header', 'jeff-tian');
        res.header('access-control-allow-origin', '*');
        res.header('access-control-allow-credentials', 'true');
        next();
    })
    await app.init();

    app.enableCors({
        maxAge: 86400
    })

    const expressApp = app.getHttpAdapter().getInstance();
    return serverlessExpress({app: expressApp});
}

export const handler = async (
    event: any,
    context,
    callback,
) => {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
};
