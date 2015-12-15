(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Cron"] = factory();
	else
		root["Cron"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

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
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Cron = (function () {
	  function Cron(data, options) {
	    _classCallCheck(this, Cron);

	    return {
	      data: data,
	      expression: Cron.make(data, options)
	    };
	  }

	  _createClass(Cron, null, [{
	    key: 'getDayOfWeekId',
	    value: function getDayOfWeekId(day) {
	      if (!isNaN(parseInt(day)) && typeof parseInt(day) === 'number') {
	        return parseInt(day);
	      } else {
	        return Cron.REVERSE_DAYS_MAP[day.substring(0, 3).toUpperCase()];
	      }
	    }
	  }, {
	    key: 'make',

	    /**
	     * Generates a new Cron expression based on same data as new instance of Cron
	     * @method make
	     * @param {object}  data
	     * @param {object}  options
	    **/
	    value: function make() {
	      var data = arguments.length <= 0 || arguments[0] === undefined ? { days: [], startTime: null } : arguments[0];
	      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	      options = _extends({}, Cron.DEFAULT_OPTIONS, options);

	      data = _extends({}, Cron.DEFAULT_DATA, data);

	      var defaultExp = '* * * * * * *',
	          expression = defaultExp.split(' '),
	          startTime = data.startTime ? data.startTime.split(':').slice(0, 3) : [],
	          days = data.days.map(Cron.getDayOfWeekId).sort(function (a, b) {
	        return a - b;
	      });

	      // Sets hours, minutes and seconds
	      if (startTime.length) {
	        if (startTime.length < 3) {
	          startTime.push('00');
	        }

	        startTime.reverse().forEach(function (value, index) {
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

	        if (!options.numeric) {
	          days = days.map(function (day) {
	            return Cron.DAYS_MAP[day];
	          });
	        }

	        expression[5] = days.join(',');

	        if (options.shorten) {
	          expression = Cron.shorten(expression, options);
	        }
	      }

	      // Sets year
	      // expression[6] = ... TODO

	      if (!Cron.isExpressionValid(expression)) {
	        var message = new Error('Failed to make Cron expression...', expression);
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
	  }, {
	    key: 'parse',
	    value: function parse() {
	      var expression = arguments.length <= 0 || arguments[0] === undefined ? '* * * * * * *' : arguments[0];

	      expression = expression.split(' ').slice(0, 7);

	      var clockUnits = expression.slice(0, 3).map(function (unit) {
	        return unit === '*' ? '00' : unit;
	      }),
	          // array
	      dw = expression[5],
	          // string to be parsed yet
	      daysOfWeek = []; // array of days after parse

	      if (dw !== '*') {
	        if (dw.indexOf(',') >= 0) {
	          dw = dw.split(',');
	        }

	        for (var i = 0; i < dw.length; i++) {
	          var day = dw[i];

	          if (day.indexOf('-') >= 0) {
	            var range = day.split('-');

	            range = range.map(Cron.getDayOfWeekId);

	            daysOfWeek.push(range[0]);

	            for (var _i = 1; _i < range[range.length - 1]; _i++) {
	              daysOfWeek.push(range[0] + _i);
	            }
	          } else {
	            daysOfWeek.push(Cron.getDayOfWeekId(day));
	          }
	        }
	      }

	      return {
	        days: daysOfWeek,
	        startTime: clockUnits[2] + ':' + clockUnits[1] + ':' + clockUnits[0]
	      };
	    }

	    /**
	     * Shortens days of week to ranges wherever possible
	     * @method shorten
	     * @param {string}  expression  - Cron expression to be shorten, e.g.: '* * * * * 1,2,3,4,5,6'
	     * @param {object}  options     - Same as when instantiating new Cron (excluding 'shorten' property, of course)
	    **/
	  }, {
	    key: 'shorten',
	    value: function shorten(expression, options) {
	      options = _extends({}, Cron.DEFAULT_OPTIONS, options);

	      var exp = Array.isArray(expression) ? expression : expression.split(' '),
	          canBeShorten = null;

	      if (exp[5] !== '*' && exp[5].indexOf(',') > 0) {
	        var i = 0,
	            days = exp[5].split(',').map(Cron.getDayOfWeekId);

	        if (!(days || days.length)) {
	          return expression;
	        }

	        while (i < days.length - 1) {
	          var next = days[i + 1],
	              current = days[i];

	          if (current > 0 && next - current === 1 || current === 0 && current + next === 1) {
	            canBeShorten = true;
	          } else {
	            canBeShorten = false;
	            break;
	          }
	          i++;
	        }

	        if (!options.numeric) {
	          days = days.map(function (day) {
	            return Cron.DAYS_MAP[day];
	          });
	        }

	        if (canBeShorten) {
	          exp[5] = days[0] + '-' + days[days.length - 1];
	          return exp.join(' ');
	        }
	      }

	      return expression;
	    }
	  }, {
	    key: 'isExpressionValid',
	    value: function isExpressionValid(expression) {
	      // TODO: validate Cron expression
	      return true;
	    }
	  }, {
	    key: 'DEFAULT_DATA',
	    get: function get() {
	      return {
	        days: [],
	        startTime: '00:00:00'
	      };
	    }
	  }, {
	    key: 'DAYS_MAP',
	    get: function get() {
	      return {
	        1: 'SUN',
	        2: 'MON',
	        3: 'TUE',
	        4: 'WED',
	        5: 'THU',
	        6: 'FRI',
	        7: 'SAT'
	      };
	    }
	  }, {
	    key: 'REVERSE_DAYS_MAP',
	    get: function get() {
	      var originalMap = Cron.DAYS_MAP,
	          reverseMap = {},
	          keyArr = Object.keys(originalMap);

	      for (var i = 0; i < keyArr.length; i++) {
	        reverseMap[originalMap[i + 1]] = i + 1;
	      }

	      return reverseMap;
	    }
	  }, {
	    key: 'DEFAULT_OPTIONS',
	    get: function get() {
	      return {
	        shorten: false,
	        numeric: true
	      };
	    }
	  }]);

	  return Cron;
	})();

	exports['default'] = Cron;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;