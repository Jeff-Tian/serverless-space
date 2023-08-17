import {Controller, Get, Post} from "@nestjs/common";
import {ZhihuService} from "./zhihu.service";

@Controller('zhihu')
export class ZhihuController {
    constructor(private readonly zhihuService: ZhihuService) {
    }

    @Post()
    async webhookOfSyncYuqueToZhihu() {
        const res = await this.zhihuService.triggerSyncGitHubAction();

        return res.data;
    }
}
