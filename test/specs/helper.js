'use strict'

var helper = require('../../es5/helper')

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
      stateMap1.set('text', {prevState: '_str1', nextState: '_str1'})
      stateMap1.set('_str1', {prevState: '_', nextState: '_'})
      stateMap1.set('_str2', {prevState: '', nextState: ''})

      var stateMap2 = new Map()
      table.set('"', stateMap2)
      stateMap2.set('text', {prevState: '_str2', nextState: '_str2'})
      stateMap2.set('_str1', {prevState: '', nextState: ''})
      stateMap2.set('_str2', {prevState: '_', nextState: '_'})

      var stateMap3 = new Map()
      table.set('\\\'', stateMap3)
      stateMap3.set('text', {prevState: 'text', nextState: 'text'})
      stateMap3.set('_str1', {prevState: '', nextState: ''})
      stateMap3.set('_str2', {prevState: '', nextState: ''})

      var stateMap4 = new Map()
      table.set('\\"', stateMap4)
      stateMap4.set('text', {prevState: 'text', nextState: 'text'})
      stateMap4.set('_str1', {prevState: '', nextState: ''})
      stateMap4.set('_str2', {prevState: '', nextState: ''})

      var stateMap5 = new Map()
      table.set('', stateMap5)
      stateMap5.set('text', {prevState: 'text', nextState: 'text'})
      stateMap5.set('_str1', {prevState: '', nextState: ''})
      stateMap5.set('_str2', {prevState: '', nextState: ''})

      set.states.should.eql(['text', '_str1', '_str2'])
      set.symbols.should.eql(['\'', '"', '\\\'', '\\"'])
      set.table.should.eql(table)

    })
  })
}