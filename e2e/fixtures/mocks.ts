import {DynamoService} from "../../src/dynamo/dynamo.service";
import {Mock} from "ts-mockery";

export const mockDynamoService = Mock.of<DynamoService>({
    saveCache: jest.fn().mockResolvedValue(undefined),
    getCache: jest.fn().mockResolvedValue('value'),
})