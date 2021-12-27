import {BabelService} from "./babel.service";

describe('babel', ()=>{
    const sut = new BabelService();

    it('transforms', async()=>{
        const res = await  sut.transform('class A {}')
        expect(res).toStrictEqual(`"use strict";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var A = /*#__PURE__*/_createClass(function A() {
  _classCallCheck(this, A);
});`)
    })
})