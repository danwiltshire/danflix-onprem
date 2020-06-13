const Job = require('../src/Job.js');
const { assert } = require('chai')

const { create } = require('domain');
var expect = require('chai').expect;
var should = require('chai').should();

describe("Job test", function() {
  it("return a number", function() {
      let job = new Job();
      let createdJob = job.create();
      assert.isNumber(createdJob);
      assert.ok(createdJob >= 0 && createdJob <= 2048);
  });
});
