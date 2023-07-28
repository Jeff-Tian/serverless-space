import {Module} from "@nestjs/common";
import {ClipboardService} from "./clipboard.service.js";
import {DynamoService} from "../dynamo/dynamo.service.js";
import {ClipboardResolver} from "./clipboard.resolver.js";

@Module({
    providers: [ClipboardResolver, DynamoService, ClipboardService],
    exports: [ClipboardService]
})
export class ClipboardModule {
}
