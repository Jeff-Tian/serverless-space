import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { Zhihu } from "./models/zhihu.model.js"
import { ZhihuService } from "./zhihu.service.js"
import { ZhihuVideoInfo } from "./models/zhihu.video.model.js";
import { plainToClass } from 'class-transformer'
import { PartialYuqueModel } from "./models/partial.yuque.model.js";

@Resolver(of => Zhihu)
export class ZhihuResolver {
    constructor(private readonly zhihuService: ZhihuService) {
    }


    @Mutation(returns => Zhihu)
    async draftColumnArticle() {
        return this.zhihuService.draftColumnArticle()
    }

    @Query(returns => ZhihuVideoInfo)
    async getVideoInfoByUrl(@Args('zvideoUrl') zvideoUrl: string) {
        return plainToClass(ZhihuVideoInfo, { playUrl: await this.zhihuService.getVideoPlayUrlByVideoPage(zvideoUrl) })
    }

    @Mutation(() => PartialYuqueModel)
    async syncYuqueToZhihu(@Args('slug') slug: string) {
        await this.zhihuService.syncYuqueToZhihu(slug)
        return { slug: slug }
    }
}
