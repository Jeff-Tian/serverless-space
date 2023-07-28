import {BabelService} from "./babel.service";
import {BabelResolver} from "./babel.resolver";
import {Module} from "@nestjs/common";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [HttpModule],
    providers: [BabelResolver, BabelService],
})
export class BabelModule {

}
