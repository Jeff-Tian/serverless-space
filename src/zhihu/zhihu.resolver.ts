import {Mutation, Resolver} from "@nestjs/graphql"
import {Zhihu} from "./models/zhihu.model"
import {ZhihuService} from "./zhihu.service"

@Resolver(of => Zhihu)
export class ZhihuResolver {
    constructor(private readonly zhihuService: ZhihuService) {
    }


    @Mutation(returns => Zhihu)
    async draftColumnArticle() {
        return this.zhihuService.draftColumnArticle()
    }
}
