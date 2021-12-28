import { Args, Query, Resolver } from "@nestjs/graphql";
import { BabelResult } from "./model/babel.result";
import { BabelService } from "./babel.service";
import * as assert from 'assert'

@Resolver(() => BabelResult)
export class BabelResolver {
    constructor(private readonly babelService: BabelService) {

    }

    @Query(() => BabelResult)
    async transform(@Args('sourceCode', { nullable: true }) sourceCode?: string, @Args('url', { nullable: true }) url?: string): Promise<BabelResult> {
        assert.ok(sourceCode || url, 'sourceCode or url must one of them be specified');

        if (sourceCode) {
            return { text: await this.babelService.transform(sourceCode) }
        }

        return { text: await this.babelService.transformFromUrl(url) }
    }
}