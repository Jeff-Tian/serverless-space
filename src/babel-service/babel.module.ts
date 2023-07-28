import {BabelService} from "./babel.service.js";
import {BabelResolver} from "./babel.resolver.js";
import {Module} from "@nestjs/common";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [HttpModule],
    providers: [BabelResolver, BabelService],
})
export class BabelModule {

}
