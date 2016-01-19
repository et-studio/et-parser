'use strict'

require('should')

var bombs = require('./specs/bomb').bombs
for (var i = 0, len = bombs.length; i < len; i++) {
  var bomb = bombs[i]
  bomb.fire()
}
