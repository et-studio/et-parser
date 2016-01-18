
import {parseTable} from './helper';
import {Machine} from './machine';

export class Parser extends Machine {
  constructor (table: string, firstState?: string) {
    super();
    let set = parseTable(table);
    this.states = set.states;
    this.symbols = set.symbols;
    this.table = set.table;
    this.firstState = firstState || this.states[0];
  }
}