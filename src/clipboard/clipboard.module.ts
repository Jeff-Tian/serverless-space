import {Module} from "@nestjs/common";
import {ClipboardService} from "./clipboard.service";
import {DynamoService} from "../dynamo/dynamo.service";
import {ClipboardResolver} from "./clipboard.resolver";

@Module({
    providers: [ClipboardResolver, DynamoService, ClipboardService],
    exports: [ClipboardService]
})
export class ClipboardModule {
}