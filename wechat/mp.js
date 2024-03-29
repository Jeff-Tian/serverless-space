const axios = require('axios')
const fs = require('fs')
const path = require('path')
const FormData = require('form-data')
const {convertToHtml} = require("./markdown");

module.exports.getAccessToken = async () => {
    console.log('getting access token with ', process.env.MP_APPID)
    return axios.post('https://api.weixin.qq.com/cgi-bin/stable_token', {
        grant_type: 'client_credential',
        appid: String(process.env.MP_APPID).trim(),
        secret: String(process.env.MP_SECRET).trim(),
        force_refresh: false
    })
}

module.exports.addTempImage = async (access_token) => {
    if (!access_token) {
        const token = await module.exports.getAccessToken();
        access_token = token.data.access_token;
    }

    const formData = new FormData();
    formData.append('media', fs.createReadStream(path.join(__dirname, './test.jpeg')));

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
    console.log('adding image with token ', access_token);
    if (!access_token) {
        const token = await module.exports.getAccessToken();
        console.log('token result = ', token.data);
        access_token = token.data.access_token;
    }

    const formData = new FormData();
    formData.append('media', fs.createReadStream(path.join(__dirname, './test.jpeg')));

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

module.exports.addPersistedBlogImage = async (access_token, blogId) => {
    console.log('adding image with token ', access_token);
    if (!access_token) {
        const token = await module.exports.getAccessToken();
        console.log('token result = ', token.data);
        access_token = token.data.access_token;
    }

    const formData = new FormData();
    formData.append('media', fs.createReadStream(path.join(__dirname, './test.jpeg')));

    console.log('uploading persisted image with token ', access_token);

    return axios.post(
        `https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=${access_token}&type=image`,
        formData,
        {
            headers: {
                ...formData.getHeaders()
            }
        }
    )
}

module.exports.addDraft = async ({title, content, content_source_url}) => {
    const token = await module.exports.getAccessToken();

    console.log('token result = ', token.data);

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

module.exports.addDrafts = async ({title, html, markdown, content_source_url, mini_program_path}) => {
    const token = await module.exports.getAccessToken();

    console.log('token result = ', token.data);

    const mediaRes = await module.exports.addPersistedImage(token.data.access_token);

    console.log('mediaRes= ', mediaRes.data.media_id);

    const miniprogramCoverImageRes = await module.exports.addPersistedBlogImage(token.data.access_token);
    console.log('miniprogramCoverImageRes = ', miniprogramCoverImageRes.data);

    const content = `${convertToHtml(markdown)}<mp-miniprogram data-miniprogram-appid="wx8c777d630f2b78e3" data-miniprogram-path="${mini_program_path}" data-miniprogram-title="在小程序中查看本文" data-miniprogram-imageurl="${miniprogramCoverImageRes.data.url}"></mp-miniprogram>`;

    console.log('content sent to wechat mp: ', content);

    return await Promise.all([
        axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token.data.access_token}`, {
            articles: [
                {
                    title,
                    author: '哈德韦',
                    content,
                    content_source_url,
                    need_open_comment: 1,
                    thumb_media_id: mediaRes.data.media_id
                }
            ]
        })
    ]);
}
