
import {STATE_BACK_MARK, STATE_CHILD_REG, IGNORE_TOKEN} from './configs';

export class Machine {
  symbols: (string | RegExp)[] = [];
  states: string[] = [];
  table: Map<string | RegExp, Map<string, {prevState: string, nextState: string}>>;
  firstState = '';

  parse (source: string, callbackFn: (state: string, token: string, index: number) => string | void) {
    if (!source) return;

    let currentState: string = this.firstState;
    let stateStack: string[] = [];
    for (let i = 0, len = source.length; i < len;) {
      let {token, prevState, nextState} = this.switchState(source, i, currentState);
      if (!token) break; // no matched token
      if (prevState === null && nextState === null) break; // no matched state

      let set = this.chargeLoopState(currentState, prevState, nextState, stateStack);
      prevState = set.prevState;
      nextState = set.nextState;

      let fnState = callbackFn(prevState, token, i);
      if (fnState && typeof fnState === 'string') {
        currentState = fnState;
      } else {
        currentState = nextState;
      }
      i += token.length;
    }
  }
  switchState (source: string, index: number, currentState: string) {
    let symbols = this.symbols;
    let char = source[index];
    let token = '';
    let prevStateOut = '';
    let nextStateOut = '';

    for (let i = 0, len = symbols.length; i < len; i++) {
      let symbol = symbols[i]
      let {prevState, nextState} = this.getState(symbol, currentState);
      if (nextState === IGNORE_TOKEN) {
        continue;
      }
      if (typeof symbol === 'string') {
        let tmp = source.substr(index, symbol.length);
        if (tmp === symbol) {
          token = symbol;
          prevStateOut = prevState;
          nextStateOut = nextState;
          break;
        }
      } else {
        if (symbol.test(char)) {
          token = char;
          prevStateOut = prevState;
          nextStateOut = nextState;
          break;
        }
      }
    }

    if (!token) {// no symbol matched, go into others
      token = char;
      let {prevState, nextState} = this.getState('', currentState);
      if (nextState === IGNORE_TOKEN) {
        prevStateOut = null;
        nextStateOut = null;
      } else {
        prevStateOut = prevState;
        nextStateOut = nextState;
      }
    }

    return {token, prevState: prevStateOut, nextState: nextStateOut}
  }
  chargeLoopState (currentState: string, prevState: string, nextState: string, stateStack: string[]) {
    let isCurrentLoop = STATE_CHILD_REG.test(currentState)
    let isNextLoop = STATE_CHILD_REG.test(nextState)
    let isBackState = nextState === STATE_BACK_MARK

    if (!isBackState && isNextLoop) {
      stateStack.push(currentState)
    }

    if (!prevState || prevState === STATE_BACK_MARK) {
      prevState = currentState
    }

    if (isCurrentLoop && !nextState) {
      nextState = currentState
    } else if (isBackState) {
      nextState = stateStack.pop() || ''
    }
    return {prevState, nextState}
  }
  getState (symbol: string | RegExp, currentState: string) {
    let map = this.table.get(symbol)
    let stateMap = map.get(currentState)
    if (!stateMap) return {prevState: null, nextState: null};
    else return stateMap;
  }
}