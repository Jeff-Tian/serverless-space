import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";

import * as Babel from "./babel.min.js";

@Injectable()
export class BabelService {
    constructor(private readonly httpService: HttpService) {

    }

    async transform(code, presets = []) {
        const sanitized = code.replace(/import.+react.*['"];/g, '').replace(/export/g, '');

        // @ts-ignore
        return Babel.transform(sanitized, {
            presets: ['env', 'react', 'typescript', ...presets],
            plugins: [],
            filename: "example.tsx"
        })?.code?.replace(/"div"/g, '"view"').replace(/"ol"/g, '"view"').replace(/"li"/g, '"view"')
    }

    async transformFromUrl(url: string, extra = '', presets = []) {
        const {data: code} = await this.httpService.get(url).toPromise()

        return this.transform(code + extra, presets)
    }
}
