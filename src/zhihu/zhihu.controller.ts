import {Body, Controller, Logger, Post} from "@nestjs/common";
import {ZhihuService} from "./zhihu.service";
import {YuqueService} from "../yuque/yuque.service";

@Controller('zhihu')
export class ZhihuController {
    private readonly logger = new Logger(ZhihuController.name);

    constructor(private readonly zhihuService: ZhihuService, private readonly yuqueService: YuqueService) {
    }

    @Post()
    async webhookOfSyncYuqueToZhihu(@Body() webhookPayload: any) {
        this.logger.log(`Received webhook payload: ${JSON.stringify(webhookPayload)}`);

        await this.zhihuService.syncYuqueToZhihu(webhookPayload.data.slug);
        this.logger.log(`Triggered GitHub Action`);

        await this.yuqueService.workflow(webhookPayload);
        this.logger.log(`Triggered Yuque Action`);

        return webhookPayload;
    }
}
