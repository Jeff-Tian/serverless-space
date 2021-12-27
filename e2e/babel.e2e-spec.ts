import {INestApplication} from "@nestjs/common"
import {Test} from "@nestjs/testing"
import request from "supertest"
import {AppModule} from "../src/app.module"

describe('Babel', () => {
    let app: INestApplication

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .compile()

        app = moduleRef.createNestApplication()
        await app.init()
    })

    it('transforms', async () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send({query: `query transformTsx {
                transform (sourceCode: "class A {}") {
                    text
                }
            }`})
            .expect({
                data: {
                    transform: {
                        text: '"use strict";\n' +
                            '\n' +
                            'function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n' +
                            '\n' +
                            'function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }\n' +
                            '\n' +
                            'function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\n' +
                            '\n' +
                            'var A = /*#__PURE__*/_createClass(function A() {\n' +
                            '  _classCallCheck(this, A);\n' +
                            '});'
                    }
                }
            })
            .expect(200)
    })
})
