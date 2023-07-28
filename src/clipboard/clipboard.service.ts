import {Injectable} from "@nestjs/common";
import {DynamoService} from "../dynamo/dynamo.service.js";

@Injectable()
export class ClipboardService {
    constructor(private readonly dynamoService: DynamoService) {
    }

    public async copyToClipboard(key: string, text: string): Promise<string> {
        await this.dynamoService.saveCache(`clipboard-${key}`, text)
        return this.getClipboardText(key);
    }

    public async getClipboardText(key: string): Promise<string> {
        return this.dynamoService.getCache(`clipboard-${key}`)
    }
}
