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
var args = process.argv.slice(2);
var cmd = args.length ? args.shift() : "run";

if (cli[cmd]) {
  cli[cmd].apply(cli,args);
} else {
  throw new Error("unknown command");
}

// - -------------------------------------------------------------------- - //
