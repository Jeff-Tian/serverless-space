import {BabelService} from "./babel.service";
import {testTargetUrl, testTargetUrl2, transformedText} from "../test/constants";
import axios from 'axios'
import {URL} from 'url'
import nock from "nock"
import fs from 'fs'
import path from 'path'

export const nockIt = (testTargetUrl: string, s: string = fs.readFileSync(path.resolve(__dirname, "../test/game.tsx"), "utf-8")) => {
    const testURL = new URL(testTargetUrl)
    nock(testURL.origin).get(testURL.pathname).reply(200, s)
};

describe('babel', () => {
    const mockHttpService = {
        get: (url) => ({toPromise: () => axios.get(url)})
    } as any

    const sut = new BabelService(mockHttpService);

    it('transforms', async () => {
        const res = await sut.transform('class A {}')
        expect(res).toStrictEqual(transformedText)
    })

    it('transforms from url', async () => {
        nockIt(testTargetUrl,);

        const res = await sut.transformFromUrl(testTargetUrl)
        expect(res).toMatch(/"use strict";/)
    })

    it('transforms from url with extra', async () => {
        nockIt(testTargetUrl, fs.readFileSync(path.resolve(__dirname, '../test/game.tsx'), 'utf-8'))
        const res = await sut.transformFromUrl(testTargetUrl, "ReactDOM.render(<Game />, document.getElementById('root'))")

        expect(res).toMatch(/"use strict";/)
    })

    it('transforms from url case 2', async () => {
        nockIt(testTargetUrl2, fs.readFileSync(path.resolve(__dirname, "../test/game.tsx"), "utf-8"))
        const res = await sut.transformFromUrl(testTargetUrl2, "ReactDOM.render(<Game />, document.getElementById('root'))")

        expect(res).toMatch(/"use strict";/)
    })

    it('transforms simple express', async () => {
        const res = await sut.transform('const s = "s";')
        expect(res).toEqual(`"use strict";

var s = "s";`)
    })

    it('transforms typescript', async () => {
        const res = await sut.transform('const s: string = "s";', ['typescript'])
        expect(res).toEqual(`"use strict";

var s = "s";`)
    })

    it('transforms typescript and jsx', async () => {
        const res = await sut.transform('const s: string = "s"; const jsx = (<button>Hello</button>)', ['typescript'])
        expect(res).toEqual(`"use strict";

var s = "s";
var jsx = /*#__PURE__*/React.createElement("button", null, "Hello");`)
    })

    it('transforms code with comments', async () => {
        const res = await sut.transform('/* comments */')
        expect(res).toEqual(`"use strict";`)
    })
})