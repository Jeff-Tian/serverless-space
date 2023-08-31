import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class ICloudModel {
    @Field(type => String)
    downloadURL: string
}
