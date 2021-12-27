import {Args, Query, Resolver} from "@nestjs/graphql";
import {BabelResult} from "./model/babel.result";
import {BabelService} from "./babel.service";

@Resolver(() => BabelResult)
export class BabelResolver {
    constructor(private readonly babelService: BabelService) {

    }

    @Query(() => BabelResult)
    async transform(@Args('sourceCode', {nullable: false}) sourceCode: string): Promise<BabelResult> {
        return {text: await this.babelService.transform(sourceCode)}
    }
}