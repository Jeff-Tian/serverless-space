import {Module} from "@nestjs/common";
import {HttpModule} from "@nestjs/axios";
import {ZhihuModule} from "../zhihu/zhihu.module";
import {WebhookController} from "./webhook.controller";
import {WebhookService} from "./webhook.service";

@Module({
    imports: [HttpModule.register({}), ZhihuModule],
    controllers: [WebhookController],
    providers: [WebhookService],
})
export class WebhookModule {
}
