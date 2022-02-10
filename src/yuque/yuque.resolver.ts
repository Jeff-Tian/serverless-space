import { NotFoundException } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { YuQue } from "./models/yuque.model"
import { YuqueService } from "./yuque.service"

@Resolver(of => YuQue)
export class YuqueResolver {
    constructor(private readonly yuqueService: YuqueService) {
    }

    @Query(returns => YuQue)
    async yuque(@Args('id', { nullable: true }) id?: string, @Args('slug', { nullable: true }) slug?: string): Promise<YuQue> {
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
    async paginatedYuque(@Args('skip', {nullable: true, defaultValue: 0}) skip?: number, @Args('take', {nullable: true, defaultValue: 5}) take?: number): Promise<YuQue[]> {
        return this.yuqueService.find(skip, take)
    }
}
