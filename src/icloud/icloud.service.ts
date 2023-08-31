import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {curlirize} from "../common/curlirize";
import axios from "axios/index";

@Injectable()
export class ICloudService {
    constructor(private readonly httpService: HttpService) {
        this.httpService.axiosRef.interceptors.request.use(config => {
            console.log(curlirize(config))
            return config
        })

        this.httpService.axiosRef.interceptors.response.use(res => {
            console.log('res = ', res.status, res.data)

            return res
        }, async err => {
            console.error('err.response = ', err.response.status)

            return Promise.reject(err.message)
        })
    }

    async getDownloadUrlOfICloudSharing(shortGUID: string) {
        const url = `https://ckdatabasews.icloud.com.cn/database/1/com.apple.cloudkit/production/public/records/resolve?ckjsBuildVersion=2310ProjectDev27&ckjsVersion=2.6.4&clientId=d3233a1b-f188-41a4-bd7f-507e05e826ac&clientBuildNumber=2317Hotfix55&clientMasteringNumber=2317Hotfix55`
        const body = {"shortGUIDs": [{"value": shortGUID}]}

        const {data} = await this.httpService.post(url, body).toPromise()

        return data.results[0].rootRecord.fields.fileContent.value.downloadURL;
    }
}
