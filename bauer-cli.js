#! /usr/bin/env node
/*!
**  bauer-cli -- Command-line interface for bauer-crawler.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-cli>
*/
// - -------------------------------------------------------------------- - //

"use strict";

var fs = require("fs");
var path = require("path");

// - -------------------------------------------------------------------- - //

var cwd = process.cwd();
var arg = process.argv[2] || "./";
var packageDir = path.resolve(cwd,arg);
var packageFile = path.resolve(cwd,arg,"package.json");
var crawlerDir = path.resolve(packageDir,"node_modules/bauer-crawler");

fs.exists(packageFile,function(packageFileExists) {
  if (packageFileExists) {
    fs.exists(crawlerDir,function(crawlerDirExists) {
      if (crawlerDirExists) {
        var Crawler = require(crawlerDir);
        var crawler = new Crawler(packageFile);
        crawler.start(packageDir);
      } else {
        throw new Error("bauer-crawler not found");
      }
    });
  } else {
    throw new Error("package.json not found");
  }
});

// - -------------------------------------------------------------------- - //
