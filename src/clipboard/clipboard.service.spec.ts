import {ClipboardService} from "./clipboard.service";
import {Mock} from "ts-mockery";
import {DynamoService} from "../dynamo/dynamo.service";

describe('clipboard', () => {
    const cache = {}
    const mockDynamoService = Mock.of<DynamoService>({
        saveCache: (key: string, text: string) => {
            cache[key] = text
            return Promise.resolve()
        },

        getCache: (key: string) => {
            return cache[key]
        }
    });
    const sut = new ClipboardService(mockDynamoService);
    const text = 'some text'

    describe('copy to clipboard', () => {
        it('copy text to clipboard by key', async () => {
            await sut.copyToClipboard('key', text)
            expect(cache).toStrictEqual({
                "clipboard-key": "some text"
            })
        })
    })

    describe('get clipboard text by key', () => {
        it('get text from clipboard by key', async () => {
            await sut.copyToClipboard('key', text)
            const res = await sut.getClipboardText('key')
            expect(res).toBe(text)
        })
    })
})