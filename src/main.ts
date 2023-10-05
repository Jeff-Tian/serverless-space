import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { AppModule } from './app.module';
import { config } from 'dotenv'
import getOrCreateHandler from './common/serverless/make-handler';

config()

let server;

async function bootstrap(): Promise<any> {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log'],
        snapshot: true,
    });

    app.enableCors({
        maxAge: 86400
    })

    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();

    return serverlessExpress({ app: expressApp });
}

export const handler = getOrCreateHandler(server, bootstrap);