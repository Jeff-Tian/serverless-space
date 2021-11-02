import {Module} from '@nestjs/common'
import {ZhihuService} from './zhihu.service'
import {HttpModule} from "@nestjs/axios"
import { ZhihuResolver } from './zhihu.resolver';

@Module({
    imports: [HttpModule.register({

    })],
    providers: [ZhihuService, ZhihuResolver],
})
export class ZhihuModule {
}
