
// token to split state
export const SPLIT_TOKEN = '|';

// token to split prevState and nextState
export const STATE_TOKEN = ':';

// the mark to break loop state to previous state
export const STATE_BACK_MARK = '_';

// RegExp to test the loop state
export const REGEXP_TEST = /^:/;

// RegExp to test the loop state
export const STATE_CHILD_REG = /^_/;

// the mark of ignore state
export const IGNORE_TOKEN = ':::';