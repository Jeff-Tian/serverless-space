import {Args, Query, Resolver} from "@nestjs/graphql";
import {ICloudModel} from "./models/icloud.model";
import {plainToClass} from "class-transformer";

@Resolver()
export class ICloudResolver {
    @Query(returns => ICloudModel, {name: 'downloadUrlOfICloudSharing'})
    async getDownloadUrlOfICloudSharing(@Args('shortGUID', {nullable: false}) shortGUID: string): Promise<ICloudModel> {
        return plainToClass(ICloudModel, {downloadURL: 'https://cvws.icloud-content.com.cn/B/AaU3WcSjEzk6SflDS9BJ7yCQkiJQAQh3tBrAlf6p8vLiS5_i4WR5x2ug/${f}?o=ApAt11YqMLAtOW6EmZKdOoYmN6jG9d-CtMg-xgcpwU5S&v=1&x=3&a=CAogb3fiRmpMUbhxJrH8ENFtxNJwwD-Eiv0BDF7R8xZtxeoSbRCq0NiJpDEYqq20i6QxIgEAUgSQkiJQWgR5x2ugaiZfY9FNKyRXACAnah0kSgbk0V6xIovVSFP6LLVfXsBnqjyLJOkjgnImb03lX_ErGUnnnrr4s1K0q6BsQZQVlbcaHH1f21BpCjSRv8ajpn0&e=1693314782&fl=&r=91e8aba8-12d8-4bfc-8456-00f633c74d02-1&k=EriN_hG224uaueW2AfCypQ&ckc=com.apple.clouddocs&ckz=com.apple.CloudDocs&p=220&s=FpaPVNI7Pr1PWLQcgrkGQ8dg8Rs'})
    }
}
