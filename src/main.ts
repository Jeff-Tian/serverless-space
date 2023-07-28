import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module.js';
import { config } from 'dotenv'

config()

let server: Handler;

async function bootstrap(): Promise<Handler> {
    const app = await NestFactory.create(AppModule);
    await app.init();

    app.enableCors({
        maxAge: 86400
    })

    const expressApp = app.getHttpAdapter().getInstance();
    // @ts-ignore
    return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback,
) => {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
};
