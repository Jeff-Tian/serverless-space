import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {ClipboardService} from "./clipboard.service";
import {ClipboardInput} from "./models/clipboard.input";
import {ClipboardModel} from "./models/clipboard.model";

@Resolver(of => ClipboardModel)
export class ClipboardResolver {
    constructor(private readonly clipboardService: ClipboardService) {
    }

    @Query(returns => String)
    async clipboard(@Args('key', {nullable: false}) key: string): Promise<string> {
        return this.clipboardService.getClipboardText(key)
    }

    @Mutation(returns => ClipboardModel)
    async copyToClipboard(@Args('clipboard', {nullable: false}) clipboard: ClipboardInput): Promise<ClipboardModel> {
        return this.clipboardService.copyToClipboard(clipboard.key, clipboard.value)
    }
}