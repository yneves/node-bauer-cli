#! /usr/bin/env node
/*!
**  bauer-cli -- Command-line interface for bauer-crawler.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-cli>
*/
// - -------------------------------------------------------------------- - //

"use strict";

var cli = require("./lib/index.js");

var cmd = process.argv[2];

if (cli[cmd]) {
  cli[cmd]();
} else {
  throw new Error("unknown command");
}

// - -------------------------------------------------------------------- - //
