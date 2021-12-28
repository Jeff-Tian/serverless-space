import {BabelService} from "./babel.service";
import {BabelResolver} from "./babel.resolver";
import {HttpModule, Module} from "@nestjs/common";

@Module({
    imports: [HttpModule],
    providers: [BabelResolver, BabelService],
})
export class BabelModule {

}