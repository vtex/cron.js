class Cron {

  static get DEFAULT_DATA() {
    return {
      days: [],
      startTime: '00:00:00'
    };
  }

  static get DAYS_MAP() {
    return {
      0: 'SUN',
      1: 'MON',
      2: 'TUE',
      3: 'WED',
      4: 'THU',
      5: 'FRI',
      6: 'SAT'
    };
  }

  static get REVERSE_DAYS_MAP() {
    let originalMap = Cron.DAYS_MAP
      , reverseMap = {}
      , keyArr = Object.keys(originalMap);

    for (let i = 0; i < keyArr.length; i++) {
      reverseMap[ originalMap[i] ] = i;
    }

    return reverseMap;
  }

  static get DEFAULT_OPTIONS() {
    return {
      optimize: false,
      numeric: true
    };
  }

  /*
  data <Object>
    days: <Array>
      0-6 <Number> or 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT' <string>
    startTime: 'HH:mm:ss' <string>
  */

  constructor(data, options) {
    return {
      data: data,
      expression: Cron.make(data, options)
    }
  }

  static make(data = { days: [], startTime: null }, options = {}) {
    options = {
      ...Cron.DEFAULT_OPTIONS,
      ...options
    };

    data = {
      ...Cron.DEFAULT_DATA,
      ...data
    };

    let defaultExp = '* * * * * * *'
      , isNumeric = true
      , expression = defaultExp.split(' ')
      , startTime = data.startTime ? data.startTime.split(':').slice(0, 3) : []
      , days = data.days.map( day => {
        if ( !isNaN(parseInt(day)) && typeof parseInt(day) === 'number' ) {
            return parseInt(day);
        } else {
          isNumeric = false;
          return Cron.REVERSE_DAYS_MAP[day.substring(0, 3).toUpperCase()];
        }
      }).sort( (a, b) => a - b );

    // Sets hours, minutes and seconds
    if (startTime.length) {
      if (startTime.length < 3) {
        startTime.push('00');
      }

      startTime.reverse().forEach((value, index) => {
        if (value) {
          if (value === '00') {
            return '*';
          }
          return expression[index] = value;
        }
      });
    }

    // Sets day of the month
    // expression[3] = ...

    // Sets month
    // expression[4] = ...

    // Sets days of the week
    if (days.length) {

      if ( options.numeric ) {
        if ( !isNumeric ) {
          days = days.map( day => Cron.REVERSE_DAYS_MAP[day] )
        }
      } else {
        if ( !isNumeric ) {
          days = days.map( day => Cron.DAYS_MAP[day] )
        }
      }

      expression[5] = days.join(',');

      if (options.optimize) {
        expression = Cron.optimize(expression, options);
      }

    }

    // Sets year
    // expression[6] = ...

    if ( !Cron.isExpressionValid(expression) ) {
      let message = new Error('Failed to make Cron expression...', expression);
      throw new Error(message);
      return message;
    }

    return typeof expression === 'string' ? expression : expression.join(' ');
  }

  static parse(expression = '* * * * * * *') {
    // TODO: Handle string days of week instead of integers (e.g.: 'MON', 'TUE')
    expression = expression.split(' ').slice(0, 7);

    let clockUnits = expression.slice(0, 3).map( unit => unit === '*' ? '00' : unit ) // array
      , dw = expression[5] // string to be parsed yet
      , daysOfWeek = [] // array of days after parse

    if (dw !== '*') {
      if (dw.indexOf(',') >= 0) {
        dw = dw.split(',');
      }

      for (let i = 0; i < dw.length; i++) {
        let day = dw[i];

        if (day.indexOf('-') >= 0) {
          let range = day.split('-');

          range = range.map( d => {
            if ( !isNaN(parseInt(d)) && typeof parseInt(d) === 'number' ) {
              return parseInt(d);
            } else {
              return Cron.REVERSE_DAYS_MAP[d.substring(0, 3).toUpperCase()];
            }
          });

          daysOfWeek.push( range[0] );

          for (let i = 1; i < range[range.length - 1]; i++) {
            daysOfWeek.push( range[0] + i );
          }
        }
        else {
          if ( !isNaN(parseInt(day)) && typeof parseInt(day) === 'number' ) {
            daysOfWeek.push(parseInt(day));
          } else {
            daysOfWeek.push(Cron.REVERSE_DAYS_MAP[day.substring(0, 3).toUpperCase()]);
          }
        }

      }
    }

    return {
      days: daysOfWeek,
      startTime: `${clockUnits[2]}:${clockUnits[1]}:${clockUnits[0]}`
    };

  }

  static optimize(expression, options) {
    options = {
      ...Cron.DEFAULT_OPTIONS,
      ...options
    }

    let exp = Array.isArray(expression) ? expression : expression.split(' ')
      , canBeShorten = null
      , isNumeric = true

    if ( exp[5] !== '*' && exp[5].indexOf(',') > 0 ) {
        let i = 0
          , days = exp[5].split(',').map( day => {
              if ( !isNaN(parseInt(day)) && typeof parseInt(day) === 'number' ) {
                return parseInt(day);
              }
              else {
                isNumeric = false;
                return Cron.REVERSE_DAYS_MAP[day];
              }
            });

      if ( !(days || days.length) ) {
        return expression;
      }

      while ( i < (days.length - 1) ) {
        let next = days[i + 1]
          , current = days[i];

        if ( (current > 0 && (next - current === 1)) || (current === 0 && (current + next) === 1) ) {
          canBeShorten = true;
        }
        else {
          canBeShorten = false;
          break;
        }
        i++;
      }

      if ( options.numeric ) {
        if ( !isNumeric ) {
          days = days.map( day => Cron.REVERSE_DAYS_MAP[day] )
        }
      }
      else {
        if ( !isNumeric ) {
          days = days.map( day => Cron.DAYS_MAP[day] )
        }
      }

      if (canBeShorten) {
        exp[5] = ( days[0] + '-' + days[days.length - 1] );
        return exp.join(' ');
      }
    }

    return expression;
  }

  static isExpressionValid(expression) {
    // TODO: validate Cron expression
    return true;
  }

}

export default Cron;
