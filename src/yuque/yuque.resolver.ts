import {NotFoundException} from '@nestjs/common'
import {Args, Info, Query, Resolver} from '@nestjs/graphql'
import {YuQue} from "./models/yuque.model.js"
import {YuqueService} from "./yuque.service.js"
import {GraphQLResolveInfo} from "graphql/type";

export const One_Month_In_Seconds = 60 * 60 * 24 * 30

@Resolver(of => YuQue)
export class YuqueResolver {
    constructor(private readonly yuqueService: YuqueService) {
    }

    @Query(returns => YuQue)
    async yuque(@Info() info: GraphQLResolveInfo, @Args('id', {nullable: true}) id?: string, @Args('slug', {nullable: true}) slug?: string): Promise<YuQue> {
        info.cacheControl.setCacheHint({maxAge: One_Month_In_Seconds})

        const article = (id && await this.yuqueService.findOneById(id)) || (slug && await this.yuqueService.findOneBySlug(slug)) || null

        if (!article) {
            throw new NotFoundException(id)
        }

        return article
    }

    @Query(returns => [YuQue])
    allYuque(): Promise<YuQue[]> {
        return this.yuqueService.findAll()
    }

    @Query(returns => [YuQue])
    async paginatedYuque(@Args('skip', {nullable: true, defaultValue: 0}) skip?: number, @Args('take', {
        nullable: true,
        defaultValue: 5
    }) take?: number): Promise<YuQue[]> {
        return this.yuqueService.find(skip, take)
    }
}
