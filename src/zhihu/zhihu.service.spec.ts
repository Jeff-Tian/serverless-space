import {INestApplication} from "@nestjs/common"
import {ZhihuService} from "./zhihu.service"
import {Test} from "@nestjs/testing"
import {ZhihuModule} from "./zhihu.module"
import nock from "nock";

describe('ZhihuService', () => {
    let app: INestApplication

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [ZhihuModule],
        }).compile()

        app = moduleRef.createNestApplication()
        await app.init()
    })

    describe('draftColumnArticle', () => {
        it('should draft an article', async () => {

        })
    })

    describe('video', () => {
        it('extracts the video id by url', async () => {
            const zhihuService = app.get(ZhihuService)
            const url = 'https://www.zhihu.com/zvideo/1492435273367248896'
            const videoId = await zhihuService.getVideoIdByZvideoUrl(url)
            expect(videoId).toBe('1492435273367248896')
        })

        it('analyzes video page and gets the video play url', async () => {
            nock('https://www.zhihu.com').get('/zvideo/1492435273367248896').reply(200, '<doc type="html"><html>...{"playUrl":"https:\u002F\u002Fvdn.vzuu.com\u002FFHD\u002F95c1f00a-afc9-11ec-8028-3eb8be366078-v4_t10000111-wdE0coEHDB.mp4?disable_local_cache=1&auth_key=1648612663-0-0-7368a808d3745b274fd50061ab1e87ab&f=mp4&bu=zvideo&expiration=1648612663&v=ali"}...</html>')

            const zhihuService = app.get(ZhihuService)
            const url = 'https://www.zhihu.com/zvideo/1492435273367248896'
            const videoId = await zhihuService.getVideoPlayUrlByVideoPage(url)
            expect(videoId).toBe('https://vdn.vzuu.com/FHD/95c1f00a-afc9-11ec-8028-3eb8be366078-v4_t10000111-wdE0coEHDB.mp4?disable_local_cache=1&auth_key=1648612663-0-0-7368a808d3745b274fd50061ab1e87ab&f=mp4&bu=zvideo&expiration=1648612663&v=ali')
        })
    })
})
