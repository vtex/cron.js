# cron.js
Weekly Cron expressions parser and generator

## Setup

#### Browser:

```html
<script src="cron.min.js"></script>
```

#### Node:

    npm i cron.js --save

```js
import Cron from 'cron.js'
```

*or*

```js
var Cron = require('cron.js')
```

## Usage

Days map reference:
```js
1: 'SUN'
2: 'MON'
3: 'TUE'
4: 'WED'
5: 'THU'
6: 'FRI'
7: 'SAT'
```

Examples:
```js
let data = {
  days: [1, 2, 3, 4, 5, 6],
  startTime: '18:30:00'
};

/* make */
new Cron( data, { shorten: true } ).expression;        //  '* 30 18 * * 1-6 *'
new Cron( data, { numeric: false } ).expression;        //  '* 30 18 * * SUN,MON,TUE,WED,THU,FRI *'
new Cron( { days: ['FRI', 'SAT'] } ).expression;        //  '* * * * * 6,7 *'
Cron.make( data, { numeric: false, shorten: true } );  //  '* 30 18 * * SUN-FRI *'

/* parse */
Cron.parse('* 30 18 * * 1-3');    // { days: [1, 2, 3], startTime: '18:30:00' }
Cron.parse('* 30 18 * * 1,3,6');  // { days: [1, 3, 6], startTime: '18:30:00' }
Cron.parse('* * 12 * * SUN-SAT'); // { days: [1, 2, 3, 4, 5, 6, 7], startTime: '12:00:00' }

```

#### Default options

```js
{
  numeric: true,  // If days of week in output expression should be integers instead of strings (e.g.: 1,2 <- SUN,MON)
  optimize: false // If days of week should be represented in ranges wherever possible (e.g.: 1-6 instead of 1,2,3,4,5,6)
}
```

#### Development - Contribute!

Source code inside `src` folder, written in ES6, that gets loaded by babel and transpiled to ES5.
Build and minified versions in `dist` folder.
Tests can be found in `test` folder.

    npm i     // Installs npm dependencies
    npm start // Compiles and minifies source code
    npm test  // Runs test suite
