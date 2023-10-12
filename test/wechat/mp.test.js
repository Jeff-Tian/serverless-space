const assert = require('assert')
const nock = require('nock')

const mp = require('../../wechat/mp')

describe("mp features", () => {
    const mockTokenRes = {
        "access_token": "73_I5O2Ts19YxIGqUekrHhKU4MgUgzCZb6a0VzMFF38_S8SDy5-El7bqDrs-27oNJipeAqar0mJ_McSi3efvXJ0Pr8XPSwpQf6bUROy42MbRVaGEx4ENxAWPh4mmUcYZMgAIAHIV",
        "expires_in": 7200
    }

    it('gets access token', async () => {
        nock('https://api.weixin.qq.com').post('/cgi-bin/stable_token', {
            grant_type: 'client_credential',
            appid: /.+/,
            secret: /.+/,
            force_refresh: false
        }).reply(200, mockTokenRes)

        const res = await mp.getAccessToken();

        assert.ok(res);
        assert.deepEqual(res.data, mockTokenRes);
    })

    it('adds an image', async () => {
        nock('https://api.weixin.qq.com').post('/cgi-bin/stable_token', {
            grant_type: 'client_credential',
            appid: /.+/,
            secret: /.+/,
            force_refresh: false
        }).reply(200, mockTokenRes)

        nock('https://api.weixin.qq.com')
            .filteringRequestBody(/.*/, '*')
            .post(`/cgi-bin/media/upload?access_token=${mockTokenRes.access_token}&type=image`, '*').reply(200, {
                "created_at": 1696231450,
                "item": [],
                "media_id": "OTC24v0nm33p4vMTERlCO-SXXxAD5Loj15meGTZJmLqpoMJhAXPJ8ebFxGoueWmW",
                "type": "image"
            })

        const res = await mp.addTempImage();
        assert.ok(res);
        assert.deepEqual(res.data, {
            "created_at": 1696231450,
            "item": [],
            "media_id": "OTC24v0nm33p4vMTERlCO-SXXxAD5Loj15meGTZJmLqpoMJhAXPJ8ebFxGoueWmW",
            "type": "image"
        });
    })

    it('adds a draft', async () => {
        nock('https://api.weixin.qq.com').post('/cgi-bin/stable_token', {
            grant_type: 'client_credential',
            appid: /.+/,
            secret: /.+/,
            force_refresh: false
        }).reply(200, mockTokenRes)

        nock('https://api.weixin.qq.com')
            .filteringRequestBody(/.*/, '*')
            .post(`/cgi-bin/material/add_material?access_token=${mockTokenRes.access_token}&type=image`, '*')
            .reply(200, {})

        nock('https://api.weixin.qq.com')
            .filteringRequestBody(/.*/, '*')
            .post(`/cgi-bin/draft/add?access_token=${mockTokenRes.access_token}`)
            .reply(200, {
                "item": [],
                "media_id": "H3tPf5wuG9Gu8tD8v7bpjWB8seLdmWdiF_LpGF0-wQzCU8XBbfiwOYgRxd8qzGqu"
            })

        const res = await mp.addDraft({
            title: 'title',
            content: 'content',
            need_open_comment: 1
        });

        assert.ok(res);
        assert.deepEqual(res.data, {
            "item": [],
            "media_id": "H3tPf5wuG9Gu8tD8v7bpjWB8seLdmWdiF_LpGF0-wQzCU8XBbfiwOYgRxd8qzGqu"
        });
    })
})
