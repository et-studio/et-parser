
import {Machine} from './machine';
import {SPLIT_TOKEN, STATE_TOKEN, REGEXP_TEST, IGNORE_TOKEN} from './configs';

const ESCAPE_MAP = {
  '&amp;': '&',
  '&line;': '|',
  '&colon;': ':',
  '&nbsp;': ' '
}

function escape (source: string) {
  let regStr = '(?:' + Object.keys(ESCAPE_MAP).join('|') + ')';
  let replacer = new RegExp(regStr, 'g');
  return source.replace(replacer, key => ESCAPE_MAP[key])
}

function translateLine (line: string) {
  let lineStates = line.split(SPLIT_TOKEN).map(item => item.trim());
  let origin = lineStates.shift();
  let symbol: string | RegExp;

  if (REGEXP_TEST.test(origin)) {
    origin = escape(origin.replace(REGEXP_TEST, ''));
    symbol = new RegExp(origin);
  } else {
    symbol = escape(origin);
  }
  return {symbol, lineStates}
}

function parseStateSet (state: string) {
  state = state.trim()
  if (state === IGNORE_TOKEN || !~state.indexOf(STATE_TOKEN)) {
    return {prevState: '', nextState: state}
  } else {
    let states = state.split(STATE_TOKEN);
    let prevState = (states[0] || '').trim();
    let nextState = (states[1] || '').trim();
    return {prevState, nextState};
  }
}

function symbolSorter (left: string | RegExp, right: string | RegExp) {
  // -1 表示left更靠前
  let leftType = (typeof left === 'string') ? 0 : 1;
  let rightType = (typeof right === 'string') ? 0 : 1;

  if (leftType - rightType) {
    return leftType - rightType
  }

  if (typeof left === 'string' && typeof right === 'string') {
    if (left.indexOf(right) === 0) return -1
    else if (right.indexOf(left) === 0) return 1
    else return 0
  }

  return 0;
}

export function parseTable (source: string) {
  let symbols: (string | RegExp)[] = [];
  let states: string[] = [];
  let table = new Map<string | RegExp, Map<string, {prevState: string, nextState: string}>>();

  let lines = source.trim().split('\n');
  states = translateLine(lines[0]).lineStates;

  for (let i = 2, len = lines.length; i < len; i++) {
    let line = lines[i];
    let {symbol, lineStates} = translateLine(line);
    let stateMap = new Map<string, {prevState: string, nextState: string}>();
    for (let j = 0, lenj = states.length; j < lenj; j++) {
      stateMap.set(states[j], parseStateSet(lineStates[j] || ''));
    }
    if (symbol) {
      symbols.push(symbol);
    }
    table.set(symbol, stateMap);
  }

  return {symbols: symbols.sort(symbolSorter), states, table};
}

