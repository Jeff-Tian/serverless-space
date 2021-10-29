import { Module } from '@nestjs/common';
import { DateScalar } from '../common/scalars/date.scalar';
import { GraphqlResolver } from './graphql.resolver';
import {GraphqlService} from "./graphql.service"

@Module({
    providers: [GraphqlResolver, GraphqlService, DateScalar],
})
export class GraphqlPluginModule {}
