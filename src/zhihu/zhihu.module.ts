import {Module} from '@nestjs/common'
import {ZhihuService} from './zhihu.service'
import {HttpModule} from "@nestjs/axios"
import {ZhihuResolver} from './zhihu.resolver';
import {ClipboardModule} from "../clipboard/clipboard.module";
import {ZhihuController} from "./zhihu.controller";
import {YuqueService} from "../yuque/yuque.service";
import {DynamoService} from "../dynamo/dynamo.service";

@Module({
    imports: [HttpModule.register({}), ClipboardModule],
    controllers: [ZhihuController],
    providers: [ZhihuService, ZhihuResolver, YuqueService, DynamoService],
})
export class ZhihuModule {
}
