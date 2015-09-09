# cron.js
Weekly Cron expressions parser and generator

## Setup

#### Browser:

```html
<script src="cron.min.js"></script>
```

#### Node:

```js
import Cron from 'cronjs'
```

*or*

```js
var Cron = require('cronjs')
```

## Usage
```js
let data = {
  days: [1, 2, 3, 4, 5, 6],
  startTime: '18:30:00'
};

/* make */
new Cron( data, { optimize: true } ).expression;        //  '* 30 18 * * 1-5 *'
new Cron( data, { numeric: false } ).expression;        //  '* 30 18 * * MON,TUE,WED,THU,FRI *'
new Cron( { days: ['FRI', 'SAT'] } ).expression;        //  '* * * * * 5,6 *'
Cron.make( data, { numeric: false, optimize: true } );  //  '* 30 18 * * MON-FRI *'

/* parse */
Cron.parse('* 30 18 * * 1-3');    // { days: [1, 2, 3], startTime: '18:30:00' }
Cron.parse('* 30 18 * * 1,3,6');  // { days: [1, 3, 6], startTime: '18:30:00' }
Cron.parse('* * 12 * * SUN-SAT'); // { days: [0, 1, 2, 3, 4, 5, 6], startTime: '12:00:00' }

```

#### Default options

```js
{
  numeric: true,  // If days of week in output expression should be integers instead of strings (e.g.: 1,2 <- MON,TUE)
  optimize: false // If days of week should be represented in ranges wherever possible (e.g.: 1-6 instead of 1,2,3,4,5,6)
}
```
