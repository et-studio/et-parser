
import {SPLIT_TOKEN, STATE_TOKEN, REGEXP_TEST, IGNORE_TOKEN} from './configs';

const ESCAPE_MAP = {
  '&amp;': '&',
  '&line;': '|',
  '&colon;': ':',
  '&break;': '\n',
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

function getWeight (symbol: string | RegExp, symbols: (string | RegExp)[]) {
  if (typeof symbol === 'string') {
    let weight = 0;
    for (let i = 0, len = symbols.length; i < len; i++) {
      let tmpSymbol = symbols[i];
      if (typeof tmpSymbol === 'string' && tmpSymbol.indexOf(symbol) === 0) {
        weight++;
      }
    }
    return weight;
  } else {
    return 9999;
  }
}

function pickSymbol (weights: number[], symbols: (string | RegExp)[]) {
  let min = 10000;
  let index = -1;

  for (let i = 0, len = weights.length; i < len; i++) {
    let w = weights[i];
    if (0 <= w && w < min) {
      min = w;
      index = i;
    }
  }
  if (index >= 0) {
    weights[index] = -1;
    return symbols[index];
  } else  {
    return null;
  }
}

function sortSymbols (symbols: (string | RegExp)[]) {
  let results: (string | RegExp)[] = [];
  let weights: number[] = symbols.map(item => getWeight(item, symbols));

  while (true) {
    let symbol = pickSymbol(weights, symbols);
    if (symbol === null) {
      break;
    } else {
      results.push(symbol);
    }
  }
  return results;
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

  return {symbols: sortSymbols(symbols), states, table};
}

