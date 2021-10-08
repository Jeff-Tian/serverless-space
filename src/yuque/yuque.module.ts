import { Module } from '@nestjs/common';
import { DateScalar } from '../common/scalars/date.scalar';
import { YuqueResolver } from './yuque.resolver';
import {YuqueService} from "./yuque.service"

@Module({
    providers: [YuqueResolver, YuqueService, DateScalar],
})
export class YuqueModule {}
