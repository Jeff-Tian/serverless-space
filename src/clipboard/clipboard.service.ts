import {Injectable} from "@nestjs/common";
import {DynamoService} from "../dynamo/dynamo.service";

@Injectable()
export class ClipboardService {
    constructor(private readonly dynamoService: DynamoService) {
    }

    public copyToClipboard(key: string, text: string) {
        return this.dynamoService.saveCache(`clipboard-${key}`, text);
    }

    public getClipboardText(key: string) {
        return this.dynamoService.getCache(`clipboard-${key}`)
    }
}