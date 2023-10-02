const axios = require('axios')

module.exports.getAccessToken = async () => {
    return axios.post('https://api.weixin.qq.com/cgi-bin/stable_token', {
        grant_type: 'client_credential',
        appid: '1234',
        secret: '5678',
        force_refresh: false
    })
}
