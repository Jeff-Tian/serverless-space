import {HttpService} from "@nestjs/axios"
import {Injectable} from "@nestjs/common"
import {Observable} from "rxjs"
import axios, {AxiosResponse} from "axios"
import {curlirize} from "../common/curlirize"
import {ClipboardService} from "../clipboard/clipboard.service";

const loginZhihu = async () => {
    return false
}

@Injectable()
export class ZhihuService {
    constructor(private readonly httpService: HttpService, private readonly clipboardService: ClipboardService) {
        this.httpService.axiosRef.interceptors.request.use(config => {
            console.log(curlirize(config))
            return config
        })

        this.httpService.axiosRef.interceptors.response.use(res => {
            console.log('res = ', res.status, res.data)

            return res
        }, async err => {
            console.error('err.response = ', err.response)

            if (err.response.status === 401 && err.response.headers?.server?.toLowerCase() !== 'github.com') {
                if (await loginZhihu()) {
                    return axios(err.config)
                }
            }

            return Promise.reject(err)
        })
    }

    async draftColumnArticle(): Promise<Observable<AxiosResponse>> {
        const url = 'https://zhuanlan.zhihu.com/api/articles/drafts'

        try {
            return await this.httpService.post(url)
        } catch (ex) {
            console.error('failed by ', ex)

            if (axios.isAxiosError(ex)) {
                console.error('axios error')
            }
        }
    }

    async getVideoPlayUrlByVideoPage(videoPageUrl: string) {
        const {data: html} = await this.httpService.get(videoPageUrl).toPromise()

        const regex = /"playUrl":"(.*?)"/
        const [, firstUrl] = html.match(regex)

        return decodeURIComponent(firstUrl.replace(/\\u002F/g, '/'))
    }

    async getVideoIdByZvideoUrl(url: string) {
        return url.substr(url.lastIndexOf('/') + 1)
    }

    async syncYuqueToZhihu(slug: string) {
        try {
            const res = await Promise.all([
                this.clipboardService.copyToClipboard(`yuque-slugs-to-sync`, JSON.stringify([slug])),
                this.httpService.post('https://api.github.com/repos/jeff-tian/sync/dispatches', {"event_type": "webhook"}, {
                    headers: {
                        Accept: 'application/vnd.github.everest-preview+json',
                        Authorization: `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`
                    }
                }).toPromise()
            ])

            console.log('res = ', res)
        } catch (ex) {
            throw ex
        }
    }
}
