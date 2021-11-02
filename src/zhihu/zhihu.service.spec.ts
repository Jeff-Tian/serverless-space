import {INestApplication} from "@nestjs/common"
import {ZhihuService} from "./zhihu.service"
import {Test} from "@nestjs/testing"
import {ZhihuModule} from "./zhihu.module"

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
})
