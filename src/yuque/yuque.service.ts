import {Injectable} from '@nestjs/common'
import {YuQue} from './models/yuque.model'
import {read, all, readBySlug} from '../gatsby-resources/yuque/index'

@Injectable()
export class YuqueService {
    async findOneBySlug(slug: string): Promise<YuQue> {
        return readBySlug(slug)
    }

    async findOneById(id: string): Promise<YuQue> {
        return read({}, id)
    }

    async findAll(): Promise<YuQue[]> {
        return (await all()) as YuQue[]
    }
}
