import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { ZhihuModule } from "../zhihu/zhihu.module";
import getOrCreateHandler from 'src/common/serverless/make-handler';

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
    return serverlessExpress({ app: expressApp });
}

export const handler = getOrCreateHandler(server, bootstrap);