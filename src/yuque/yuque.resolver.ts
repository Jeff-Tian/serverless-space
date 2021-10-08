import {NotFoundException} from '@nestjs/common'
import {Args, Query, Resolver} from '@nestjs/graphql'
import {YuQue} from "./models/yuque.model"
import {YuqueService} from "./yuque.service"

@Resolver(of => YuQue)
export class YuqueResolver {
    constructor(private readonly yuqueService: YuqueService) {
    }

    @Query(returns => YuQue)
    async yuque(@Args('id') id: string): Promise<YuQue> {
        const recipe = await this.yuqueService.findOneById(id)
        if (!recipe) {
            throw new NotFoundException(id)
        }
        return recipe
    }

    @Query(returns => [YuQue])
    allYuque(): Promise<YuQue[]> {
        return this.yuqueService.findAll()
    }
}
