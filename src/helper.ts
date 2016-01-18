
import {Machine} from './machine';

const SPLIT_TOKEN = '|';
const STATE_TOKEN = ':';

/*
 *       | prev      | str1  | str2  | reg       | after
 * ----- | ------    | ----- | ----- | --------- | -----
 * '\''  | prev:str1 | after | str2  | reg       | error2
 * '"'   | prev:str2 | str1  | after | reg       | error2
 * '['   | reg       | str1  | str2  | reg       | error2
 * ']'   | error1    | str1  | str2  | reg:after | error2
 * '\\]' | error1    | str1  | str2  | reg       | error2
 * '\\\''| error1    | str1  | str2  | reg       | error2
 * '\\"' | error1    | str1  | str2  | reg       | error2
 * '|'   | end       | str1  | str2  | reg       | end
 * [\\s] | prev      | str1  | str2  | reg       | after
 *       | error1    | str1  | str2  | reg       | error2
 */

const parser = new Machine();
const reg = /[\s]/;
parser.states = ['prev', 'str1', 'str2', 'reg', 'after'];
parser.symbols = ['\'', '"', '[', ']', '\\]', '\\\'', '\\"', '|', reg];
parser.table = new Map<string | RegExp, Map<string, {prevState: string, nextState: string}>>();
parser.firstState = 'prev';

let stateMap1 = new Map<string, {prevState: string, nextState: string}>();
parser.table.set('\'', stateMap1)
stateMap1.set('prev', {prevState: 'prev', nextState: 'str1'});
stateMap1.set('str1', {prevState: 'after', nextState: 'after'});
stateMap1.set('str2', {prevState: 'str2', nextState: 'str2'});
stateMap1.set('reg', {prevState: 'reg', nextState: 'reg'});
stateMap1.set('after', {prevState: 'error2', nextState: 'error2'});

let stateMap2 = new Map<string, {prevState: string, nextState: string}>();
parser.table.set('"', stateMap2)
stateMap2.set('prev', {prevState: 'prev', nextState: 'str2'});
stateMap2.set('str1', {prevState: 'str1', nextState: 'str1'});
stateMap2.set('str2', {prevState: 'after', nextState: 'after'});
stateMap2.set('reg', {prevState: 'reg', nextState: 'reg'});
stateMap2.set('after', {prevState: 'error2', nextState: 'error2'});

let stateMap3 = new Map<string, {prevState: string, nextState: string}>();
parser.table.set('[', stateMap3)
stateMap3.set('prev', {prevState: 'reg', nextState: 'reg'});
stateMap3.set('str1', {prevState: 'str1', nextState: 'str1'});
stateMap3.set('str2', {prevState: 'st2', nextState: 'str2'});
stateMap3.set('reg', {prevState: 'reg', nextState: 'reg'});
stateMap3.set('after', {prevState: 'error2', nextState: 'error2'});

let stateMap4 = new Map<string, {prevState: string, nextState: string}>();
parser.table.set(']', stateMap4)
stateMap4.set('prev', {prevState: 'error1', nextState: 'error1'});
stateMap4.set('str1', {prevState: 'str1', nextState: 'str1'});
stateMap4.set('str2', {prevState: 'st2', nextState: 'str2'});
stateMap4.set('reg', {prevState: 'reg', nextState: 'after'});
stateMap4.set('after', {prevState: 'error2', nextState: 'error2'});

let stateMap5 = new Map<string, {prevState: string, nextState: string}>();
parser.table.set('\\]', stateMap5)
stateMap5.set('prev', {prevState: 'error1', nextState: 'error1'});
stateMap5.set('str1', {prevState: 'str1', nextState: 'str1'});
stateMap5.set('str2', {prevState: 'st2', nextState: 'str2'});
stateMap5.set('reg', {prevState: 'reg', nextState: 'reg'});
stateMap5.set('after', {prevState: 'error2', nextState: 'error2'});

let stateMap6 = new Map<string, {prevState: string, nextState: string}>();
parser.table.set('\\\'', stateMap6)
stateMap6.set('prev', {prevState: 'error1', nextState: 'error1'});
stateMap6.set('str1', {prevState: 'str1', nextState: 'str1'});
stateMap6.set('str2', {prevState: 'st2', nextState: 'str2'});
stateMap6.set('reg', {prevState: 'reg', nextState: 'reg'});
stateMap6.set('after', {prevState: 'error2', nextState: 'error2'});

let stateMap7 = new Map<string, {prevState: string, nextState: string}>();
parser.table.set('\\"', stateMap7)
stateMap7.set('prev', {prevState: 'error1', nextState: 'error1'});
stateMap7.set('str1', {prevState: 'str1', nextState: 'str1'});
stateMap7.set('str2', {prevState: 'st2', nextState: 'str2'});
stateMap7.set('reg', {prevState: 'reg', nextState: 'reg'});
stateMap7.set('after', {prevState: 'error2', nextState: 'error2'});

let stateMap8 = new Map<string, {prevState: string, nextState: string}>();
parser.table.set('|', stateMap8)
stateMap8.set('prev', {prevState: 'end', nextState: 'end'});
stateMap8.set('str1', {prevState: 'str1', nextState: 'str1'});
stateMap8.set('str2', {prevState: 'st2', nextState: 'str2'});
stateMap8.set('reg', {prevState: 'reg', nextState: 'reg'});
stateMap8.set('after', {prevState: 'end', nextState: 'end'});

let stateMap9 = new Map<string, {prevState: string, nextState: string}>();
parser.table.set(reg, stateMap9)
stateMap9.set('prev', {prevState: 'prev', nextState: 'prev'});
stateMap9.set('str1', {prevState: 'str1', nextState: 'str1'});
stateMap9.set('str2', {prevState: 'st2', nextState: 'str2'});
stateMap9.set('reg', {prevState: 'reg', nextState: 'reg'});
stateMap9.set('after', {prevState: 'after', nextState: 'after'});

let stateMap10 = new Map<string, {prevState: string, nextState: string}>();
parser.table.set('', stateMap10)
stateMap10.set('prev', {prevState: 'error1', nextState: 'error1'});
stateMap10.set('str1', {prevState: 'str1', nextState: 'str1'});
stateMap10.set('str2', {prevState: 'st2', nextState: 'str2'});
stateMap10.set('reg', {prevState: 'reg', nextState: 'reg'});
stateMap10.set('after', {prevState: 'end', nextState: 'end'});

function parseSymbol (line: string) {
  let isEnd = false;
  let isReg = false;
  let symbol = '';
  let rest = '';
  parser.parse(line, function (state: string, token: string, index: number) {
     // 'prev', 'str1', 'str2', 'reg', 'after', 'end', 'error1', 'error2'
     switch (state) {
       case 'prev':
       case 'after':
         break;
       case 'str1':
       case 'str2':
         symbol += token;
         break;
       case 'reg':
         symbol += token;
         isReg = true;
         break;
       case 'end':
         isEnd = true;
         rest = line.substr(index + token.length);
         break;
       case 'error1':
         throw new Error('Wrong format: Your symbol should start with \' or " or [');
       case 'error2':
         throw new Error('Wrong format: Your symbol should end with \' or " or [');
     }
  })
  if (!isEnd) throw new Error('Wrong format: Your symbol is not end');

  return {symbol: isReg?new RegExp(symbol):symbol, rest}
}

function splitStateLine (line: string) {
  let states = line.split(SPLIT_TOKEN);
  states.shift(); // remove the first one
  return states.map(item => item.trim());
}

function splitTokenLine (line: string) {
  let list = line.split(SPLIT_TOKEN);
  return list.map((item) => {
    let state = item.trim();
    if (~state.indexOf(STATE_TOKEN)) {
      let states = item.split(STATE_TOKEN);
      let prevState = (states[0] || '').trim();
      let nextState = (states[1] || '').trim();
      return {prevState, nextState}
    } else {
      return {prevState: state, nextState: state}
    }
  })
}

function symbolSorter (left: string | RegExp, right: string | RegExp) {
  let isLeftReg = typeof left !== 'string';
  let isRightReg = typeof right !== 'string';

  if (typeof left === 'string' && typeof right === 'string') {
    if (left.indexOf(right) === 0) return -1
    else if (right.indexOf(left) === 0) return 1
    else return 0
  } else if (!isLeftReg && isRightReg) {
    return 1;
  } else if (isLeftReg && !isRightReg) {
    return -1;
  } else {
    return 0;
  }
}

export function parseTable (source: string) {
  let symbols: (string | RegExp)[] = [];
  let states: string[] = [];
  let table = new Map<string | RegExp, Map<string, {prevState: string, nextState: string}>>();

  let lines = source.trim().split('\n');
  states = splitStateLine(lines[0]);

  for (let i = 2, len = lines.length; i < len; i++) {
    let line = lines[i];
    let {symbol, rest} = parseSymbol(line);
    let stateMap = new Map<string, {prevState: string, nextState: string}>();
    let stateList = splitTokenLine(rest);
    for (let j = 0, lenj = stateList.length; j < lenj; j++) {
      stateMap.set(states[j], stateList[j]);
    }
    symbols.push(symbol);
    table.set(symbol, stateMap);
  }

  return {symbols: symbols.sort(symbolSorter), states, table};
}

