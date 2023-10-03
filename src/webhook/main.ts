import {NestFactory} from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import {ZhihuModule} from "../zhihu/zhihu.module";

let server;

async function bootstrap(): Promise<any> {
    const app = await NestFactory.create(ZhihuModule, {
        logger: ['error', 'warn', 'log'],
        bodyParser: false
    });
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
