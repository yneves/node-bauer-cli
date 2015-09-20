// - -------------------------------------------------------------------- - //

"use strict";

var assert = require("assert");
var cli = require("../");

// - -------------------------------------------------------------------- - //

describe("cli",function() {

  it("constructor",function() {
    assert.strictEqual(typeof cli.add,"function");
    assert.strictEqual(typeof cli.remove,"function");
    assert.strictEqual(typeof cli.init,"function");
    assert.strictEqual(typeof cli.run,"function");
  });
  
});

// - -------------------------------------------------------------------- - //
