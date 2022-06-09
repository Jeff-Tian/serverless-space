import {Field, InputType, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class ClipboardModel {
    @Field( type => String)
    key: string;

    @Field( type => String)
    value: string;
}