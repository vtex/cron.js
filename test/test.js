var expect = require('chai').expect;
var Cron = require('../dist/cron.js');

describe('# Make', function() {
  it('should make a new Cron expression with given data Object', function() {
    var data = {
      days: [1, 2, 3],
      startTime: '12:00:00'
    };

    var cron = new Cron(data);

    expect(cron).to.be.an('object');
    expect(cron.expression).to.be.a('string');
    expect(cron.expression).to.equal('* * 12 * * 1,2,3 *');
  });

  it('should make a new Cron expression with optimized days of the week with given data Object', function() {
    var data = {
      days: [1, 2, 3, 4, 5, 6]
    };

    var options = {
      optimize: true
    };

    var cron = new Cron(data, options);

    expect(cron.expression).to.equal('* * * * * 1-6 *');
  });

  it('should accept string days of the week instead of integers and make a new cron Expression', function() {
    var data = {
      days: ['MON', 'TUE', 'WED']
    };

    var options = {
      numeric: false
    };

    var cron = new Cron(data, options);

    expect(cron).to.be.an('object');
    expect(cron.expression).to.be.a('string');
    expect(cron.expression).to.equal('* * * * * MON,TUE,WED *');
  });
});

describe('# Optimize', function() {
  it('should optimize the days of the week of a given Cron expression', function() {
    var expression = '* * 12 * * 1,2,3 *'
      , optimized = Cron.optimize(expression);

    expect(optimized).to.equal('* * 12 * * 1-3 *');
  });
});
