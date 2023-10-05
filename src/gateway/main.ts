import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { GatewayModule } from "./gateway.module";
import getOrCreateHandler from 'src/common/serverless/make-handler';

let server;

async function bootstrap(): Promise<any> {
    const app = await NestFactory.create(GatewayModule, {
        logger: ['error', 'warn', 'log']
    });

    app.enableCors({
        maxAge: 86400
    })

    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    return serverlessExpress({ app: expressApp });
}

export const handler = getOrCreateHandler(server, bootstrap);