'use strict'

var helper = require('../../es5/helper')
var describe = global.describe
var it = global.it

exports.fire = function () {
  describe('helper.parseTable', function () {
    it('quotation marks', function () {
      var set = helper.parseTable(`
             | text  | _str1 | _str2
        ---  | ----  | ----- | -----
        '    | _str1 | _     |
        "    | _str2 |       | _
        \\'  | text  |       |
        \\"  | text  |       |
             | text  |       |
      `)

      var table = new Map()
      var stateMap1 = new Map()
      table.set('\'', stateMap1)
      stateMap1.set('text', {prevState: '', nextState: '_str1'})
      stateMap1.set('_str1', {prevState: '', nextState: '_'})
      stateMap1.set('_str2', {prevState: '', nextState: ''})

      var stateMap2 = new Map()
      table.set('"', stateMap2)
      stateMap2.set('text', {prevState: '', nextState: '_str2'})
      stateMap2.set('_str1', {prevState: '', nextState: ''})
      stateMap2.set('_str2', {prevState: '', nextState: '_'})

      var stateMap3 = new Map()
      table.set('\\\'', stateMap3)
      stateMap3.set('text', {prevState: '', nextState: 'text'})
      stateMap3.set('_str1', {prevState: '', nextState: ''})
      stateMap3.set('_str2', {prevState: '', nextState: ''})

      var stateMap4 = new Map()
      table.set('\\"', stateMap4)
      stateMap4.set('text', {prevState: '', nextState: 'text'})
      stateMap4.set('_str1', {prevState: '', nextState: ''})
      stateMap4.set('_str2', {prevState: '', nextState: ''})

      var stateMap5 = new Map()
      table.set('', stateMap5)
      stateMap5.set('text', {prevState: '', nextState: 'text'})
      stateMap5.set('_str1', {prevState: '', nextState: ''})
      stateMap5.set('_str2', {prevState: '', nextState: ''})

      set.states.should.eql(['text', '_str1', '_str2'])
      set.symbols.should.eql(['\'', '"', '\\\'', '\\"'])
      set.table.should.eql(table)
    })

    it('escape', function () {
      var set = helper.parseTable(`
                   | text
        ---------- | ----
        :[&break;] | reg-break
        &amp;      | and
        &line;     | line
        &colon;    | colon
        &break;    | break
        &nbsp;     | space
                   | text
      `)

      var reg = set.symbols[set.symbols.length - 1]
      var table = new Map()
      var regMap = new Map()
      table.set(reg, regMap)
      regMap.set('text', {prevState: '', nextState: 'reg-break'})

      var andMap = new Map()
      table.set('&', andMap)
      andMap.set('text', {prevState: '', nextState: 'and'})

      var lineMap = new Map()
      table.set('|', lineMap)
      lineMap.set('text', {prevState: '', nextState: 'line'})

      var colonMap = new Map()
      table.set(':', colonMap)
      colonMap.set('text', {prevState: '', nextState: 'colon'})

      var breakMap = new Map()
      table.set('\n', breakMap)
      breakMap.set('text', {prevState: '', nextState: 'break'})

      var spaceMap = new Map()
      table.set(' ', spaceMap)
      spaceMap.set('text', {prevState: '', nextState: 'space'})

      var endMap = new Map()
      table.set('', endMap)
      endMap.set('text', {prevState: '', nextState: 'text'})

      reg.toString().should.eql('/[\n]/')
      set.states.should.eql(['text'])
      set.symbols.should.eql(['&', '|', ':', '\n', ' ', reg])
      set.table.should.eql(table)
    })

    it('symbols sort', function () {
      var set = helper.parseTable(`
                         | text
          -------------- | ------
          [#if&nbsp;     | text
          [#elseif&nbsp; | text
          [#else         | text
          ]              | text
          [/#if]         | text
          {{             | _str
          }}             | text
          '              | text
          "              | text
          \\'            | text
          \\"            | text
                         | text
      `)
      set.symbols.should.eql(['[#if ', '[#elseif ', ']', '[/#if]', '{{', '}}', '\'', '"', '\\\'', '\\"', '[#else'])
    })
  })
}
