
const STATE_BACK_MARK = '_'
const STATE_CHILD_REG = /^_/

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
      let {token, symbol} = this.getToken(source, i)
      let {prevState, nextState} = this.switchState(symbol, currentState, stateStack);

      let fnState = callbackFn(prevState, token, i);
      if (fnState && typeof fnState === 'string') {
        currentState = fnState;
      } else {
        currentState = nextState;
      }
      i += token.length
    }
  }
  getToken (source: string, index: number) {
    let symbols = this.symbols;
    let char = source[index];
    let token = char;
    let kick: string | RegExp = '';

    for (let i = 0, len = symbols.length; i < len; i++) {
      let symbol = symbols[i]
      if (typeof symbol === 'string') {
        let tmp = source.substr(index, symbol.length);
        if (tmp === symbol) {
          kick = token = symbol;
          break;
        }
      } else {
        if (symbol.test(char)) {
          token = char;
          kick = symbol;
          break;
        }
      }
    }
    return {token, symbol: kick}
  }
  switchState (symbol: string | RegExp, currentState: string, stateStack: string[]) {
    let map = this.table.get(symbol)
    let {prevState, nextState} = map.get(currentState) || {prevState: '', nextState: ''};

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
}