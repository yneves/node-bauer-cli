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
var npm = require("npm");
var yeoman = require("yeoman-environment");

var yo = yeoman.createEnv();
yo.register(require.resolve("generator-bauer-script"),"bauer:script");
yo.register(require.resolve("generator-bauer-plugin"),"bauer:plugin");

// - -------------------------------------------------------------------- - //

module.exports = {
  
  // bauer add [plugin]
  add: function() {
    var plugin = process.argv[3];
    var cwd = process.cwd();
    var packageFile = path.resolve(cwd,"package.json");
    
    fs.exists(packageFile,function(packageFileExists) {
      if (packageFileExists) {
        
        var packageData = require(packageFile);
        if (!packageData.plugins) {
          packageData.plugins = [];
        }
        if (packageData.plugins.indexOf(plugin) === -1) {
          packageData.plugins.push(plugin);
        }
        if (!packageData.dependencies) {
          packageData.dependencies = {};
        }
        if (!packageData.dependencies[plugin]) {
          packageData.dependencies[plugin] = "*";
        }
        
        packageData = JSON.stringify(packageData,null,2);
        
        fs.writeFile(packageFile,packageData,function(error) {
          if (error) {
            throw error;
          } else {
            
            npm.load(function(error,npm) {
              if (error) {
                throw error;
              } else {
                npm.commands.install([plugin],function(error) {
                  if (error) {
                    throw error;
                  }
                });
              };
            });
          }
        });
        
      } else {
        throw new Error("package.json not found");
      }
    });
  },
  
  // bauer remove [plugin]
  remove: function() {
    var plugin = process.argv[3];
    var cwd = process.cwd();
    var packageFile = path.resolve(cwd,"package.json");
    
    fs.exists(packageFile,function(packageFileExists) {
      if (packageFileExists) {
        
        var packageData = require(packageFile);
        if (packageData.plugins) {
          var indexOf = packageData.plugins.indexOf(plugin);
          if (indexOf > -1) {
            packageData.plugins.splice(indexOf,1);
          }
        }
        
        packageData = JSON.stringify(packageData,null,2);
        
        fs.writeFile(packageFile,packageData,function(error) {
          if (error) {
            throw error;
          } else {
            
            npm.load(function(error,npm) {
              if (error) {
                throw error;
              } else {
                npm.commands.uninstall([plugin],function(error) {
                  if (error) {
                    throw error;
                  }
                });
              };
            });
          }
        });
        
      } else {
        throw new Error("package.json not found");
      }
    });
  },
  
  // bauer init
  init: function(what) {
    what = what || "script";
    yo.run("bauer:" + what,function() {});
  },
  
  // bauer run
  run: function() {
    var script = path.resolve(arguments.length ? arguments[0] : process.cwd());
    var scriptDir = path.dirname(script);
    var scriptArg = script === scriptDir ? path.resolve(scriptDir, "package.json") : script;
    var crawlerDir = path.resolve(scriptDir, "node_modules/bauer-crawler");
    fs.exists(crawlerDir, function(crawlerDirExists) {
      if (crawlerDirExists) {
        var Crawler = require(crawlerDir);
        var crawler = new Crawler(scriptArg);
        crawler.start();
      } else {
        throw new Error("bauer-crawler not found");
      }
    });
  }
  
};

// - -------------------------------------------------------------------- - //
