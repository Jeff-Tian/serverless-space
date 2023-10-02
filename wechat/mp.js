const axios = require('axios')
const fs = require('fs')
const path = require('path')
const FormData = require('form-data')

module.exports.getAccessToken = async () => {
    return axios.post('https://api.weixin.qq.com/cgi-bin/stable_token', {
        grant_type: 'client_credential',
        appid: '1234',
        secret: '5678',
        force_refresh: false
    })
}

module.exports.addTempImage = async (access_token) => {
    if (!access_token) {
        const token = await module.exports.getAccessToken();
        access_token = token.data.access_token;
    }

    const formData = new FormData();
    formData.append('media', fs.createReadStream(path.join(__dirname, './test.png')));

    console.log('uploading with token ', access_token);

    return axios.post(
        `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${access_token}&type=image`,
        formData,
        {
            headers: {
                ...formData.getHeaders()
            }
        }
    )
}

module.exports.addPersistedImage = async (access_token) => {
    if (!access_token) {
        const token = await module.exports.getAccessToken();
        access_token = token.data.access_token;
    }

    const formData = new FormData();
    formData.append('media', fs.createReadStream(path.join(__dirname, './test.png')));

    console.log('uploading persisted image with token ', access_token);

    return axios.post(
        `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${access_token}&type=image`,
        formData,
        {
            headers: {
                ...formData.getHeaders()
            }
        }
    )
}

module.exports.addDraft = async ({ title, content, content_source_url }) => {
    const token = await module.exports.getAccessToken();

    const mediaRes = await module.exports.addPersistedImage(token.data.access_token);

    console.log('mediaRes= ', mediaRes.data.media_id);
    
    return axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token.data.access_token}`, {
        articles: [
            {
                title,
                content,
                content_source_url,
                need_open_comment: 1,
                thumb_media_id: mediaRes.data.media_id
            }
        ]
    });
}
