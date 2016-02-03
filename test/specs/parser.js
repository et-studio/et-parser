'use strict'

var Parser = require('../../es5/parser').Parser

exports.fire = function () {
  describe('parser.parse', function () {
    it('emoji parse', function () {
      var table = `
                  | text       | emojiStart | emojiKey   | emojiEnd
        --------- | ----       | ---------- | --------   | --------
        [         | emojiStart | emojiStart | emojiStart | emojiStart
        ]         | text       | text       | emojiEnd   | text
        :[\\w\\.] | text       | emojiKey   | emojiKey   | text
                  | text       | text       | text       | text
      `;
      var parser = new Parser(table)
      var results = []
      parser.parse('header[emoji.smile]tail', function (state, token, index) {
        results.push([state, token, index])
      })

      let expects = [
        ['text', 'h', 0],
        ['text', 'e', 1],
        ['text', 'a', 2],
        ['text', 'd', 3],
        ['text', 'e', 4],
        ['text', 'r', 5],
        ['emojiStart', '[', 6],
        ['emojiKey', 'e', 7],
        ['emojiKey', 'm', 8],
        ['emojiKey', 'o', 9],
        ['emojiKey', 'j', 10],
        ['emojiKey', 'i', 11],
        ['emojiKey', '.', 12],
        ['emojiKey', 's', 13],
        ['emojiKey', 'm', 14],
        ['emojiKey', 'i', 15],
        ['emojiKey', 'l', 16],
        ['emojiKey', 'e', 17],
        ['emojiEnd', ']', 18],
        ['text', 't', 19],
        ['text', 'a', 20],
        ['text', 'i', 21],
        ['text', 'l', 22]
      ]

      results.should.eql(expects)
    })

    it('attributes parse', function () {
      var table = `
               | scan         | key        | keyEnd       | valueStart    | value{{ | value         | value'         | value"         | _str
        ------ | ------       | ---        | ------       | ----------    | ------- | -----         | ------         | ------         | ----
        :[\\s] | scan         | keyEnd     | keyEnd       | valueStart    | value{{ | valueEnd:scan | value'         | value"         |
        '      | keyStart:key | key        | keyStart:key | ignore:value' | value{{ | value         | value'End:scan | value"         |
        "      | keyStart:key | key        | keyStart:key | ignore:value" | value{{ | value         | value'         | value"End:scan |
        =      | keyStart:key | valueStart | valueStart   | value         | value{{ | value         | value'         | value"         |
        \\'    | keyStart:key | key        | keyStart:key | value         | value{{ | value         | value'         | value"         |
        \\"    | keyStart:key | key        | keyStart:key | value         | value{{ | value         | value'         | value"         |
        {{     | keyStart:key | key        | keyStart:key | value{{       | value{{ | _str          | _str           | _str           |
        }}     | keyStart:key | key        | keyStart:key | value         | value   | value         | value'         | value"         | _
               | keyStart:key | key        | keyStart:key | value         | value{{ | value         | value'         | value"         |
      `;
      var parser = new Parser(table)
      var results = []
      parser.parse(`id=element class="title" value='123'`, function (state, token, index) {
        results.push([state, token, index])
      })

      let expects = [
        ['keyStart', 'i', 0],
        ['key', 'd', 1],
        ['valueStart', '=', 2],
        ['value', 'e', 3],
        ['value', 'l', 4],
        ['value', 'e', 5],
        ['value', 'm', 6],
        ['value', 'e', 7],
        ['value', 'n', 8],
        ['value', 't', 9],
        ['valueEnd', ' ', 10],
        ['keyStart', 'c', 11],
        ['key', 'l', 12],
        ['key', 'a', 13],
        ['key', 's', 14],
        ['key', 's', 15],
        ['valueStart', '=', 16],
        ['ignore', '"', 17],
        ['value"', 't', 18],
        ['value"', 'i', 19],
        ['value"', 't', 20],
        ['value"', 'l', 21],
        ['value"', 'e', 22],
        ['value"End', '"', 23],
        ['scan', ' ', 24],
        ['keyStart', 'v', 25],
        ['key', 'a', 26],
        ['key', 'l', 27],
        ['key', 'u', 28],
        ['key', 'e', 29],
        ['valueStart', '=', 30],
        ['ignore', '\'', 31],
        ['value\'', '1', 32],
        ['value\'', '2', 33],
        ['value\'', '3', 34],
        ['value\'End', '\'', 35]
      ]

      results.should.eql(expects)
    })

    it('ignore state parse', function () {
      var table = `
                             | ignore | item              | indexPre | index             | expression     | trackBy
        -------------------- | ------ | ----              | -------- | --------          | ----------     | -------
        :[\\s]               | ignore |                   |          |                   | expression     | trackBy
        :[,;]                |        | ignore:indexPre   |          | index             | expression     | trackBy
        &nbsp;in&nbsp;       | :::    | ignore:expression |          | ignore:expression | expression     | trackBy
        &nbsp;track by&nbsp; |        |                   |          |                   | ignore:trackBy | trackBy
                             | item   | item              | index    | index             | expression     | trackBy
      `;
      var parser = new Parser(table)
      var results = []
      parser.parse(` in in it.list`, function (state, token, index) {
        results.push([state, token, index])
      })

      let expects = [
        ['ignore', ' ', 0],
        ['item', 'i', 1],
        ['item', 'n', 2],
        ['ignore', ' in ', 3],
        ['expression', 'i', 7],
        ['expression', 't', 8],
        ['expression', '.', 9],
        ['expression', 'l', 10],
        ['expression', 'i', 11],
        ['expression', 's', 12],
        ['expression', 't', 13]
      ]

      results.should.eql(expects)
    })
  })
}