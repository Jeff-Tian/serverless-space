import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {ClipboardService} from "./clipboard.service.js";
import {ClipboardInput} from "./models/clipboard.input.js";
import {ClipboardModel} from "./models/clipboard.model.js";

@Resolver(of => ClipboardModel)
export class ClipboardResolver {
    constructor(private readonly clipboardService: ClipboardService) {
    }

    @Query(returns => ClipboardModel)
    async clipboard(@Args('key', {nullable: false}) key: string): Promise<ClipboardModel> {
        return {key, value: await this.clipboardService.getClipboardText(key)}
    }

    @Mutation(returns => ClipboardModel)
    async copyToClipboard(@Args('clipboard', {nullable: false}) clipboard: ClipboardInput): Promise<ClipboardModel> {
        return {key: clipboard.key, value: await this.clipboardService.copyToClipboard(clipboard.key, clipboard.value)}
    }
}
