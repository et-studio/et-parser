
import * as mocha from 'mocha';
import * as should from 'should';

require('should');
interface Bomb {
  fire(): void;
}

let bombs: Bomb[] = require('./specs/bomb').bombs;
for (let i = 0, len = bombs.length; i < len; i++) {
  let bomb = bombs[i];
  bomb.fire();
}
