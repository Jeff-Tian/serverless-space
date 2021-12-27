import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class BabelResult {
    @Field(() => String)
    text: string
}