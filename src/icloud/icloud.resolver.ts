import {Args, Query, Resolver} from "@nestjs/graphql";
import {ICloudModel} from "./models/icloud.model";
import {plainToClass} from "class-transformer";
import {ICloudService} from "./icloud.service";

@Resolver()
export class ICloudResolver {
    constructor(private readonly icloudService: ICloudService) {
    }

    @Query(returns => ICloudModel, {name: 'downloadUrlOfICloudSharing'})
    async getDownloadUrlOfICloudSharing(@Args('shortGUID', {nullable: false}) shortGUID: string): Promise<ICloudModel> {
        return plainToClass(ICloudModel, {downloadURL: await this.icloudService.getDownloadUrlOfICloudSharing(shortGUID)})
    }
}
