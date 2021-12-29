import { BabelService } from "./babel.service";
import { testTargetUrl, transformedText } from "../test/constants";
import axios from 'axios'

describe('babel', () => {
  const mockHttpService = {
    get: (url) => ({ toPromise: () => axios.get(url) })
  } as any

  const sut = new BabelService(mockHttpService);

  it('transforms', async () => {
    const res = await sut.transform('class A {}')
    expect(res).toStrictEqual(transformedText)
  })

  it('transforms from url', async () => {
    const res = await sut.transformFromUrl(testTargetUrl)
    expect(res).toMatch(/"use strict";/)
  })

  it('transform from url with extra', async () => {
    const res = await sut.transformFromUrl(testTargetUrl, "ReactDOM.render(<Game />, document.getElementById('root'))")

    console.log('res = ', res)

    expect(res).toMatch(/"use strict";/)
  })
})