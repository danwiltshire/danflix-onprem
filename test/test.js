const { assert } = require('chai');
require('../src/app.js')

describe("Basic Number Tests", function() {
  it("should be equal to 2", function() {
    assert.equal( (1 + 1), 2);
  });
});

describe("app.js function tests", function() {
  it("getRandomInt should return a random number between 0-2048", function() {
    const randomInt = getRandomInt(2048);
    assert.ok( randomInt >= 0 && randomInt <= 2048 );
  });
});