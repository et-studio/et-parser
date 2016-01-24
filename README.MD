# et-parser [![NPM version](https://img.shields.io/npm/v/et-parser.svg?style=flat-square)](https://www.npmjs.com/package/et-parser)

## Installation
```console
npm install et-parser --save-dev
```

## Useage


```javascript

var Parser = require('et-parser').Parser

var table = `
          | text       | emojiStart | emojiKey   | emojiEnd
--------  | ----       | ---------- | --------   | --------
[         | emojiStart | emojiStart | emojiStart | emojiStart
]         | text       | text       | emojiEnd   | text
:[\\w\\.] | text       | emojiKey   | emojiKey   | text
          | text       | text       | text       | text
`

var parser = new Parser(table)
parser.parse('header[emoji.smile]tail', function (state, token, index) {
  console.log(state, token, index)
})
```

The result will be:
```
text h 0
text e 1
text a 2
text d 3
text e 4
text r 5
emojiStart [ 6
emojiKey e 7
emojiKey m 8
emojiKey o 9
emojiKey j 10
emojiKey i 11
emojiKey . 12
emojiKey s 13
emojiKey m 14
emojiKey i 15
emojiKey l 16
emojiKey e 17
emojiEnd ] 18
text t 19
text a 20
text i 21
text l 22
```

## License
MIT