/**
 * Cron Utils
 * @class
 * @param {object}      data                      - Data to be used when generating new expression
 * @param {number[]}    data.days                 - List of selected days, e.g.: [1, 2, 3] or ['MON', 'TUE', 'WED'] or [1, 'TUE', 3]
 * @param {string}      data.startTime=00:00:00   - HH:mm:ss, e.g.: '18:30:00'
 * @param {object}      options                   - Custom options
 * @param {boolean}     options.shorten=false     - If expresison should have it's week days shorten when making or instantiating
 * @param {boolean}     options.numeric=true      - If days of week should be represented as integers in new expression (instead of strings of 3 characters each)
**/
class Cron {

  constructor(data, options) {
    return {
      data: data,
      expression: Cron.make(data, options)
    }
  }

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

  static getDayOfWeekId(day) {
    if ( !isNaN(parseInt(day)) && typeof parseInt(day) === 'number' ) {
        return parseInt(day);
    } else {
      return Cron.REVERSE_DAYS_MAP[day.substring(0, 3).toUpperCase()];
    }
  }

  static get DEFAULT_OPTIONS() {
    return {
      shorten: false,
      numeric: true
    };
  }

  /**
   * Generates a new Cron expression based on same data as new instance of Cron
   * @method make
   * @param {object}  data
   * @param {object}  options
  **/
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
      , expression = defaultExp.split(' ')
      , startTime = data.startTime ? data.startTime.split(':').slice(0, 3) : []
      , days = data.days.map(Cron.getDayOfWeekId).sort( (a, b) => a - b );

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
    // expression[3] = ... TODO

    // Sets month
    // expression[4] = ... TODO

    // Sets days of the week
    if (days.length) {

      if ( !options.numeric ) {
        days = days.map( day => Cron.DAYS_MAP[day] )
      }

      expression[5] = days.join(',');

      if (options.shorten) {
        expression = Cron.shorten(expression, options);
      }

    }

    // Sets year
    // expression[6] = ... TODO

    if ( !Cron.isExpressionValid(expression) ) {
      let message = new Error('Failed to make Cron expression...', expression);
      throw new Error(message);
      return message;
    }

    return typeof expression === 'string' ? expression : expression.join(' ');
  }

  /**
   * Parses an expression and returns respective detailed data object
   * @method parse
   * @param {string}  expression='* * * * * * *'  - Cron expression to be parsed
  **/
  static parse(expression = '* * * * * * *') {
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

          range = range.map(Cron.getDayOfWeekId);

          daysOfWeek.push( range[0] );

          for (let i = 1; i < range[range.length - 1]; i++) {
            daysOfWeek.push( range[0] + i );
          }
        }
        else {
          daysOfWeek.push(Cron.getDayOfWeekId(day));
        }

      }
    }

    return {
      days: daysOfWeek,
      startTime: `${clockUnits[2]}:${clockUnits[1]}:${clockUnits[0]}`
    };

  }

  /**
   * Shortens days of week to ranges wherever possible
   * @method shorten
   * @param {string}  expression  - Cron expression to be shorten, e.g.: '* * * * * 1,2,3,4,5,6'
   * @param {object}  options     - Same as when instantiating new Cron (excluding 'shorten' property, of course)
  **/
  static shorten(expression, options) {
    options = {
      ...Cron.DEFAULT_OPTIONS,
      ...options
    }

    let exp = Array.isArray(expression) ? expression : expression.split(' ')
      , canBeShorten = null;

    if ( exp[5] !== '*' && exp[5].indexOf(',') > 0 ) {
        let i = 0
          , days = exp[5].split(',').map(Cron.getDayOfWeekId);

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

      if ( !options.numeric ) {
        days = days.map( day => Cron.DAYS_MAP[day] )
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
