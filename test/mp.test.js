const assert = require('assert')
const nock = require('nock')

const mp = require('../wechat/mp')

describe("mp features", () => {
    it('gets access token', async () => {
        const expectedResult = {
            "access_token": "73_I5O2Ts19YxIGqUekrHhKU4MgUgzCZb6a0VzMFF38_S8SDy5-El7bqDrs-27oNJipeAqar0mJ_McSi3efvXJ0Pr8XPSwpQf6bUROy42MbRVaGEx4ENxAWPh4mmUcYZMgAIAHIV",
            "expires_in": 7200
        }

        nock('https://api.weixin.qq.com').post('/cgi-bin/stable_token', {
            grant_type: 'client_credential',
            appid: '1234',
            secret: '5678',
            force_refresh: false
        }).reply(200, expectedResult)

        const res = await mp.getAccessToken();

        assert.ok(res);
        assert.deepEqual(res.data, expectedResult);
    })
})