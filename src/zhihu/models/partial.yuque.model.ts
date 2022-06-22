import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class PartialYuqueModel {
    @Field(() => String)
    slug: string
}