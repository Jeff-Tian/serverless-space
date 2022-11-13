import { Module } from '@nestjs/common';
import { YuqueResolver } from './yuque.resolver';
import {YuqueService} from "./yuque.service"
import {DynamoService} from "../dynamo/dynamo.service";

@Module({
    providers: [YuqueResolver, YuqueService, DynamoService],
})
export class YuqueModule {}
