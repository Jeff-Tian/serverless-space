import {Body, Controller, Logger, Post} from "@nestjs/common";
import {ZhihuService} from "./zhihu.service";

@Controller('zhihu')
export class ZhihuController {
    private readonly logger = new Logger(ZhihuController.name);

    constructor(private readonly zhihuService: ZhihuService) {
    }

    @Post()
    async webhookOfSyncYuqueToZhihu(@Body() webhookPayload: any) {
        this.logger.log(`Received webhook payload: ${JSON.stringify(webhookPayload)}`);

        const res = await this.zhihuService.triggerSyncGitHubAction();

        this.logger.log(`Triggered GitHub Action: ${JSON.stringify(res.data)}`);
        return res.data;
    }
}
