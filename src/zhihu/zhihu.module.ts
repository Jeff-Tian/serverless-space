import {Module} from '@nestjs/common'
import {ZhihuService} from './zhihu.service'
import {HttpModule} from "@nestjs/axios"
import { ZhihuResolver } from './zhihu.resolver';
import {ClipboardModule} from "../clipboard/clipboard.module";

@Module({
    imports: [HttpModule.register({

    }), ClipboardModule],
    providers: [ZhihuService, ZhihuResolver],
})
export class ZhihuModule {
}
