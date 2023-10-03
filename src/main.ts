import {NestFactory} from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import {AppModule} from './app.module';
import {config} from 'dotenv'
import bodyParser from "body-parser";

config()

let server;

async function bootstrap(): Promise<any> {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log'],
        snapshot: true,
    });

    await app.init();

    app.enableCors({
        maxAge: 86400
    })

    const expressApp = app.getHttpAdapter();
    expressApp.useBodyParser('json', false, {limit: 10240000});
    expressApp.useBodyParser('raw', false, {limit: 10240000});

    const instance = expressApp.getInstance();

    return serverlessExpress({app: instance});
}

export const handler = async (
    event: any,
    context,
    callback,
) => {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
};
