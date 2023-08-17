import {Module} from '@nestjs/common'
import {ZhihuService} from './zhihu.service'
import {HttpModule} from "@nestjs/axios"
import {ZhihuResolver} from './zhihu.resolver';
import {ClipboardModule} from "../clipboard/clipboard.module";
import {ZhihuController} from "./zhihu.controller";

@Module({
    imports: [HttpModule.register({}), ClipboardModule],
    controllers: [ZhihuController],
    providers: [ZhihuService, ZhihuResolver],
})
export class ZhihuModule {
}
