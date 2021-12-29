import {HttpService, Injectable} from "@nestjs/common";

const Babel = require('./babel.min.js')

@Injectable()
export class BabelService {
    constructor(private readonly httpService: HttpService) {

    }

    async transform(code) {
        return Babel.transform(code.replace(/import.+;/g, '').replace(/export/g, ''), {
            presets: ['env', 'react'],
            plugins: []
        })?.code?.replace(/"div"/g, '"view"').replace(/"ol"/g, '"view"')
    }

    async transformFromUrl(url, extra = '') {
        const {data: code} = await this.httpService.get(url).toPromise()

        return this.transform(code + extra)
    }
}