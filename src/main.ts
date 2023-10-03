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

    const expressApp = app.getHttpAdapter().getInstance();

    const serverlessExpressApp = serverlessExpress({app: expressApp});
    serverlessExpressApp.use(bodyParser.json({limit: '10mb'}));
    serverlessExpressApp.use(bodyParser.raw({limit: '10mb'}));

    return serverlessExpressApp;
}

export const handler = async (
    event: any,
    context,
    callback,
) => {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
};
