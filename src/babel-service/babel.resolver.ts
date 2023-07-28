import {Args, Query, Resolver} from "@nestjs/graphql";
import {BabelResult} from "./model/babel.result.js";
import {BabelService} from "./babel.service.js";
import * as assert from 'assert'

@Resolver(() => BabelResult)
export class BabelResolver {
    constructor(private readonly babelService: BabelService) {

    }

    @Query(() => BabelResult)
    async transform(@Args('sourceCode', {nullable: true}) sourceCode?: string, @Args('url', {nullable: true}) url?: string, @Args('extra', {nullable: true}) extra?: string, @Args('presets', {
        nullable: true,
        type: () => [String]
    }) presets?: string[]): Promise<BabelResult> {
        assert.ok(sourceCode || url, 'sourceCode or url must one of them be specified');

        if (sourceCode) {
            return {text: await this.babelService.transform(sourceCode, presets ?? [])}
        }

        return {text: await this.babelService.transformFromUrl(url, extra, presets ?? [])}
    }
}
