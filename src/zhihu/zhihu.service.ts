import {HttpService} from "@nestjs/axios"
import {Injectable} from "@nestjs/common"
import {Observable} from "rxjs"
import axios, {AxiosResponse} from "axios"
import {curlirize} from "../common/curlirize"

const loginZhihu = async () => {
    return false
}

@Injectable()
export class ZhihuService {
    constructor(private httpService: HttpService) {
        this.httpService.axiosRef.interceptors.request.use(config => {
            console.log(curlirize(config))
            return config
        })

        this.httpService.axiosRef.interceptors.response.use(res => {
            console.log('res = ', res.status, res.data)

            return res
        }, async err => {
            console.error('err = ', err.response)

            if (err.response.status === 401) {
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
        const {data:html} = await this.httpService.get(videoPageUrl).toPromise()

        const regex = /"playUrl":"(.*?)"/
        const [, firstUrl] = html.match(regex)

        return decodeURIComponent(firstUrl.replace(/\\u002F/g, '/'))
    }

    async getVideoIdByZvideoUrl(url: string) {
        return url.substr(url.lastIndexOf('/') + 1)
    }
}
