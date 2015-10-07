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

  it('should make a new Cron expression with shorten days of the week with given data object', function() {
    var data = {
      days: [1, 2, 3, 4, 5, 6]
    };

    var options = {
      shorten: true
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

describe('# Parse', function() {
  it('should parse an expression and return data object', function() {
    var data = Cron.parse('* 30 18 * * 1,4,6 *');

    expect(data).to.be.an('object');
    expect(data.days).to.be.an('array');
    expect(data.startTime).to.be.a('string');
    expect(data.days.length).to.equal(3);

    expect(data.days).to.deep.equal([1, 4, 6]);
    expect(data.startTime).to.equal('18:30:00');
  });

  it('should parse an expression (with strings representing days of week instead of integers) and return data object', function() {
    var data = Cron.parse('* 30 18 * * MON,WED,FRI *');

    expect(data).to.be.an('object');
    expect(data.days).to.be.an('array');
    expect(data.startTime).to.be.a('string');
    expect(data.days.length).to.equal(3);

    expect(data.days).to.deep.equal([1, 3, 5]);
    expect(data.startTime).to.equal('18:30:00');
  });
});

describe('# Shorten', function() {
  it('should shorten the days of the week of a given Cron expression', function() {
    var expression = '* * 12 * * 1,2,3 *'
      , shorten = Cron.shorten(expression);

    expect(shorten).to.equal('* * 12 * * 1-3 *');
  });
});
