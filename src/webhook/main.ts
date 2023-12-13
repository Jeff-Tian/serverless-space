import {NestFactory} from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import getOrCreateHandler from '../common/serverless/make-handler';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {WebhookModule} from "./webhook.module";

async function setupSwagger(app) {
    const options = new DocumentBuilder()
        .setTitle('Webhook')
        .setDescription('Webhook API description')
        .setVersion('1.0')
        .addTag('webhook')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);
}

let server;

async function bootstrap(): Promise<any> {
    const app = await NestFactory.create(WebhookModule, {
        logger: ['error', 'warn', 'log'],
        bodyParser: false
    });

    app.enableCors({
        maxAge: 86400
    })

    await setupSwagger(app);

    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    return serverlessExpress({app: expressApp});
}

export const handler = getOrCreateHandler(server, bootstrap);
