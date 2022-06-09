import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class ClipboardInput {
    @Field( type => String)
    key: string;

    @Field( type => String)
    value: string;
}