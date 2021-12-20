import { Module } from '@nestjs/common';
import { DateScalar } from '../common/scalars/date.scalar';
import { YuqueResolver } from './yuque.resolver';
import {YuqueService} from "./yuque.service"
import {DynamoService} from "../dynamo/dynamo.service";

@Module({
    providers: [YuqueResolver, YuqueService, DateScalar, DynamoService],
})
export class YuqueModule {}
