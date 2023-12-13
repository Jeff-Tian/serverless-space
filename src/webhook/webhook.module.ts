import {Module} from "@nestjs/common";
import {HttpModule} from "@nestjs/axios";
import {ZhihuModule} from "../zhihu/zhihu.module";
import {WebhookController} from "./webhook.controller";

@Module({
    imports: [HttpModule.register({}), ZhihuModule],
    controllers: [WebhookController],
    providers: [],
})
export class WebhookModule {
}
