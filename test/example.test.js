"use strict";
require("mocha");
const chai = require("chai");

const lib = require("../lib/index");

describe("Example of the tests:", function () {
  it("test 1", async function () {
    chai.expect(lib.loadStripe).to.be.an("function");
    return;
  });
});
