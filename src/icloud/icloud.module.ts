import {Module} from "@nestjs/common";
import {ICloudResolver} from "./icloud.resolver";

@Module({
    providers: [ICloudResolver]
})
export class ICloudModule {
}
