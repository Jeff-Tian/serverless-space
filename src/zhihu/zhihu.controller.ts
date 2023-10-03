import {Body, Controller, Logger, Post} from "@nestjs/common";
import {ZhihuService} from "./zhihu.service";
import {YuqueService} from "../yuque/yuque.service";

@Controller('zhihu')
export class ZhihuController {
    private readonly logger = new Logger(ZhihuController.name);

    constructor(private readonly zhihuService: ZhihuService, private readonly yuqueService: YuqueService) {
    }

    @Post()
    async webhookOfSyncYuqueToZhihu(@Body() buffer: Buffer) {
        const stringFromBuffer = buffer.toString();
        this.logger.log(`Received webhook payload: ${stringFromBuffer}`);

        const payload = JSON.parse(stringFromBuffer);
        await this.zhihuService.syncYuqueToZhihu(payload.data.slug);
        this.logger.log(`Triggered GitHub Action`);

        await this.yuqueService.workflow(payload);
        this.logger.log(`Triggered Yuque Action`);

        return payload;
    }
}
