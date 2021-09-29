const assert = require('assert');
const { escapeSpecialCharacters } = require('../src/escape-special-characters')

describe("escape sepcial characters", () => {
    it("escapes for undefined", () => {
        const actual = escapeSpecialCharacters(undefined)
        assert(actual === '');
    })

    it('escapes single quote', ()=>{
        const actual = escapeSpecialCharacters("Hello ' World")
        assert(actual === 'Hello  World');
    })
})