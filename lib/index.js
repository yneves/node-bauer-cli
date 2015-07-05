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
var factory = require("bauer-factory");

// - -------------------------------------------------------------------- - //

module.exports = factory.createObject({
  
  // new CLI() :CLI
  constructor: function() {
    this.cwd = process.cwd();
    this.arg = process.argv[2] || "./";
    this.packageDir = path.resolve(this.cwd,this.arg);
    this.packageFile = path.resolve(this.cwd,this.arg,"package.json");
    this.crawlerDir = path.resolve(this.packageDir,"node_modules/bauer-crawler");
  },
  
  // .existsPackage() :Boolean
  existsPackage: function() {
    return fs.existsSync(this.packageFile);
  },
  
  // .requirePackage() :Object
  requirePackage: function() {
    return require(this.packageFile);
  },
  
  // .requireModule() :Object
  requireModule: function() {
    return require(this.packageDir);
  },
  
  // .existsCrawler() :Boolean
  existsCrawler: function() {
    return fs.existsSync(this.crawlerDir);
  },
  
  // .requireCrawler() :Crawler
  requireCrawler: function() {
    return require(this.crawlerDir);
  },
  
  // .getConfig() :Object
  getConfig: function() {
    var pkg = this.requirePackage();
    if (factory.isObject(pkg.config)) {
      return pkg.config;
    } else {
      return {};
    }
  },
  
  // .getPlugins() :Object
  getPlugins: function() {
    var pkg = this.requirePackage();
    if (factory.isArray(pkg.plugins)) {
      return pkg.plugins;
    } else {
      return [];
    }
  },
  
  // .getModule() :String
  getModule: function() {
    return this.packageDir;
  },
  
  // .run() :void
  run: function() {
    if (this.existsPackage()) {
      if (this.existsCrawler()) {
        var Crawler = this.requireCrawler();
        var crawler = new Crawler(this.getConfig());
        crawler.require(this.getPlugins());
        crawler.ready(this.getModule());
        crawler.start();
      } else {
        throw new Error("bauer-crawler module not found");
      }
    } else {
      throw new Error("package.json not found");
    }
  }
  
});

// - -------------------------------------------------------------------- - //
