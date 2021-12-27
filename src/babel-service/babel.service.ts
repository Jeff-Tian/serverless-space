import {Injectable} from "@nestjs/common";
const Babel = require('./babel.min.js')

@Injectable()
export class BabelService {
    async transform(code) {
        return Babel.transform(code, {presets: ['env', 'react'], plugins: []})?.code?.replace(/"div"/g, '"view"').replace(/"ol"/g, '"view"')
    }
}