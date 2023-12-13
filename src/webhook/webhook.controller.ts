import {Body, Controller, Logger, Query, Post} from "@nestjs/common";

@Controller('webhook')
export class WebhookController {
    private readonly logger = new Logger(WebhookController.name);

    constructor() {
    }

    @Post()
    async proxy(@Body() buffer: Buffer, @Query('target') target: string) {
        this.logger.log(`Received webhook, target: ${target}`);
        const stringFromBuffer = buffer.toString();
        this.logger.log(`Received webhook payload: ${stringFromBuffer}`);

        const payload = JSON.parse(stringFromBuffer);

        return payload;
    }
}
