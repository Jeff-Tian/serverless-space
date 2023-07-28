import {Module} from '@nestjs/common'
import {ZhihuService} from './zhihu.service.js'
import {HttpModule} from "@nestjs/axios"
import { ZhihuResolver } from './zhihu.resolver.js';
import {ClipboardModule} from "../clipboard/clipboard.module.js";

@Module({
    imports: [HttpModule.register({

    }), ClipboardModule],
    providers: [ZhihuService, ZhihuResolver],
})
export class ZhihuModule {
}
