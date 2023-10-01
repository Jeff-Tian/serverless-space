import {Module} from '@nestjs/common';
import {YuqueResolver} from './yuque.resolver';
import {YuqueService} from "./yuque.service"
import {DynamoService} from "../dynamo/dynamo.service";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [HttpModule],
    providers: [YuqueResolver, YuqueService, DynamoService],
})
export class YuqueModule {
}
