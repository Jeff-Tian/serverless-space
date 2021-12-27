import {BabelService} from "./babel.service";
import {BabelResolver} from "./babel.resolver";
import {Module} from "@nestjs/common";

@Module({
    providers: [BabelResolver, BabelService],
})
export class BabelModule {

}