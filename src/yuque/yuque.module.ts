import { Module } from '@nestjs/common';
import { YuqueResolver } from './yuque.resolver.js';
import {YuqueService} from "./yuque.service.js"
import {DynamoService} from "../dynamo/dynamo.service.js";

@Module({
    providers: [YuqueResolver, YuqueService, DynamoService],
})
export class YuqueModule {}
