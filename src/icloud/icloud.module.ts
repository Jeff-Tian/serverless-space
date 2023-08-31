import {Module} from "@nestjs/common";
import {ICloudResolver} from "./icloud.resolver";
import {ICloudService} from "./icloud.service";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [HttpModule.register({})],
    providers: [ICloudResolver, ICloudService]
})
export class ICloudModule {
}
